#! /usr/bin/env node

//
// Copyright 2013 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

'use strict';

var todos = require('../todos.js');

var inquirer = require('inquirer');
var actions = {
  add: add,
  deleteCompleted: deleteCompleted,
  displayTodos: displayTodos,
  displayTodosAndDelete: displayTodosAndDelete,
  exit: process.kill
};

// Start the prompts.
init();

function init() {
  inquirer.prompt([
    {
      message: 'What would you like to do?',
      name: 'action',
      type: 'list',
      choices: [
        {
          name: 'List Todos',
          value: 'displayTodos'
        },
        {
          name: 'Add a Todo',
          value: 'add'
        },
        {
          name: 'Delete Todos',
          value: 'displayTodosAndDelete'
        },
        {
          name: 'Delete Completed Todos',
          value: 'deleteCompleted'
        },
        new inquirer.Separator(),
        {
          name: 'Exit',
          value: 'exit'
        }
      ]
    }
  ], function(answers) {
    actions[answers.action](answers);
  });
}

function add() {
  inquirer.prompt({
    message: 'What do you need to do?',
    name: 'text'
  }, function(answers) {
    todos.insert({
      text: answers.text
    }, function(err) {
      if (err) {
        throw err;
      }
      init();
    });
  });
}

function displayTodos() {
  todos.getAll(function(err, entities) {
    if (err) {
      throw err;
    }
    if (entities.length === 0) {
      console.log('There are no todos!\n');
      init();
      return;
    }
    inquirer.prompt({
      message: 'What have you completed?',
      name: 'completed',
      type: 'checkbox',
      choices: entities.map(function(entity) {
        return {
          name: entity.text,
          checked: entity.done,
          value: entity
        };
      })
    }, function(answers) {
      // Update entities model.
      entities = entities.map(function(entity) {
        if (answers.completed.some(function(completed) {
          return completed.id === entity.id;
        })) {
          entity.done = true;
        } else {
          entity.done = false;
        }
        return entity;
      });

      var updated = 0;
      entities.forEach(function(entity) {
        var id = entity.id;
        delete entity.id;
        todos.update(id, entity, function(err) {
          if (err) {
            throw err;
          }
          if (++updated === entities.length) {
            init();
          }
        });
      });
    });
  });
}

function displayTodosAndDelete() {
  todos.getAll(function(err, entities) {
    if (err) {
      throw err;
    }
    inquirer.prompt({
      message: 'What would you like to delete?',
      name: 'completed',
      type: 'checkbox',
      choices: entities.map(function(entity) {
        return {
          name: entity.text,
          checked: false,
          value: entity
        };
      })
    }, function(answers) {
      var deleted = 0;
      answers.completed.forEach(function(todo) {
        todos.delete(todo.id, function(err) {
          if (err) {
            throw err;
          }
          if (++deleted === answers.completed.length) {
            init();
          }
        });
      });
    });
  });
}

function deleteCompleted() {
  todos.deleteCompleted(function(err) {
    if (err) {
      throw err;
    }
    init();
  });
}