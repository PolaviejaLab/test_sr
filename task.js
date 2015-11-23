
experimentFrontendControllers.controller('SI', ['$scope', '$http', '$cookies', '$controller', '$interval',
  function($scope, $http, $cookies, $controller, $interval)
  {
    $scope.resources = $scope.screen.root;
    $scope.prefix += "SI.";

    $scope.playing = false;
    $scope.timer = undefined;

    $controller('PaginatedScreen', {$scope: $scope});
    $scope.set_number_of_items_per_page(1);

    $scope.responses['SI.1.playing'] = false;

    // Start new timer
    $scope.timer = $interval(function() {
      var value = $scope.get_timer_value();

      if(value === undefined)
        return;

      if(value <= 0)
        return;

      $scope.set_timer_value(value - 1);
    }, 1000, 0);


    $scope.reset_all_timers = function()
    {
      for(var i = 0; i < $scope.all_questions.length; i++) {
        var question = $scope.all_questions[i];

        if(question.type != 'initial_guess' &&
           question.type != 'after_average')
           continue;

        var id = $scope.prefix + question.question.id + '.' + question.type + '.timer';

        if(id in $scope.responses && $scope.responses[id] != question.question.timeout)
          $scope.responses[id] = question.question.timeout;
      }
    }


    /**
     * Returns the key of the current timer
     */
    $scope.get_timer_id = function()
    {
      if(!(0 in $scope.questions))
        return undefined;

      if($scope.questions[0].type != 'initial_guess' &&
         $scope.questions[0].type != 'after_average')
         return undefined;

      return $scope.prefix +
          $scope.questions[0].question.id +
          '.' + $scope.questions[0].type +
          '.timer';
    }


    /**
     * Returns the current value of the timer
     */
    $scope.get_timer_value = function()
    {
      var id = $scope.get_timer_id();

      if(id === undefined)
        return undefined;

      if(!(id in $scope.responses))
        $scope.responses[id] = $scope.questions[0].question.timeout;

      return $scope.responses[id];
    }


    /**
     * Sets the new value of the timer
     */
    $scope.set_timer_value = function(value)
    {
      var id = $scope.get_timer_id();

      if(id === undefined)
        return undefined;

      $scope.responses[id] = value;
      return $scope.responses[id];
    }


    $scope.on_after_flip = function(direction)
    {
      var page_nr = $scope.get_page();
      var question = $scope.questions[0];

      // Don't to anything if going backwards
      if(direction == -1)
        return;

      // Return if initial_guess was answered
      var id = $scope.prefix + $scope.questions[0].question.id + '.' + 'initial_guess';

      if((id in $scope.responses) && ($scope.responses[id] != ""))
        return;

      // Otherwise skip after_average page
      if(question.type == 'after_average')
        $scope.next();
    }


    $scope.is_next_allowed = function()
    {
      // Get timer for initial count
      if(0 in $scope.questions)
      {
        var prev_id = $scope.prefix + $scope.questions[0].question.id + '.' + 'initial_guess';

        // If timer expired on previous page and no initial guess is present
        //  allow skipping the after average page
        if($scope.questions[0].type == 'after_average' &&
           (prev_id + '.timer') in $scope.responses &&
           $scope.responses[prev_id + '.timer'] == 0 &&
           (!(prev_id in $scope.responses) ||
           $scope.responses[prev_id] == ""))
           return true;
      }

      if($scope.get_page() == 0)
      {
        // Do not allow if playing sound
        if('SI.1.playing' in $scope.responses) {
          if($scope.responses['SI.1.playing'] == true)
            return false;
        }

        // Only allow if played at least once
        if(!('SI.1.play_count' in $scope.responses))
          return false;

        if($scope.responses['play_count'] == 0)
          return false;
      }

      // Enable next if timer expired
      if($scope.get_timer_value() <= 0)
        return true;

      // Only enable next if question has been answered
      for(var i = 0; i < $scope.questions.length; i++) {
        var id = $scope.prefix + $scope.questions[0].question.id + '.' + $scope.questions[0].type;

        if($scope.questions[0].type == 'intro')
          continue;

        if(!(id in $scope.responses))
          return false;
      }

      return true;
    }


    $scope.format = function(value) {
      var thousands = Math.floor(value / 1000);

      if(thousands != 0)
        return thousands + " " + (value - thousands * 1000);
      else
        return value;
    }


    $scope.get_average = function() {
      var average = 1;

      if($scope.questions.length == 0)
        return undefined;

      var id = $scope.prefix + $scope.questions[0].question.id + '.initial_guess';
      var initial_guess = $scope.responses[id];

      average = $scope.questions[0].question.answer

      // Format value
      average = $scope.format(average);

      // Get the units
      var units = $scope.questions[0].question.unit;

      // Get the correct plural
      if(average == 1)
        return average + " " + units[0];
      return average + " " + units[1];
    }


    $http.get($scope.resources + 'Resources/Questions.json').
        success(function (data, status) {

          data.forEach(function(element) {
            $scope.all_questions.push({
              "type": "intro",
              "question": element
            });

            $scope.all_questions.push({
              "type": "initial_guess",
              "question": element
            });

            $scope.all_questions.push({
              "type": "after_average",
              "question": element
            });
          });

          $scope.slice();
        });
  }
]);
