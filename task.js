/**
 * Sentence reconstruction test (SR)
 * 
 * See README.md for details.
 */
experimentFrontendControllers.controller('SR', ['$scope', '$http', '$cookies', '$controller', '$interval',
  function($scope, $http, $cookies, $controller, $interval)
  {
    $scope.resources = $scope.screen.root;
    $scope.prefix += "SR.";

    $scope.playing = false;
    $scope.timer = undefined;

    $scope.button_label = "Undefined";

    $controller('PaginatedScreen', {$scope: $scope});
    $scope.set_number_of_items_per_page(1);

    var participantId = 1;

    // Build a list of trials
    for(var trialId = 1; trialId < 4; trialId++)
    {
      // Add three screens for every trial
      $scope.all_questions.push({
        "id": trialId,
        "type": "wait_for_individual",
      });

      $scope.all_questions.push({
        "id": trialId,
        "type": "write_sentence",
      });

      $scope.all_questions.push({
        "id": trialId,
        "type": "go_to_individual",
      });

      // Set audio playback to false
      $scope.responses[$scope.prefix + trialId + '.playing'] = false;

      // Only reset play-count if the play_count variable does not yet exist
      if(!($scope.prefix + trialId + '.play_count' in $scope.responses))
        $scope.responses[$scope.prefix + trialId + '.play_count'] = 0;
    }

    $scope.slice();    


    /////////////////////
    // Timer functions //
    /////////////////////


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

        if(question.type != 'write_sentence')
           continue;

        var id = $scope.prefix + question.id + '.' + question.type + '.timer';

        if(id in $scope.responses && $scope.responses[id] != question.timeout)
          $scope.responses[id] = question.timeout;
      }
    }


    /**
     * Returns the key of the current timer
     */
    $scope.get_timer_id = function()
    {
      if(!(0 in $scope.questions))
        return undefined;

      if($scope.questions[0].type != 'write_sentence')
         return undefined;

      return $scope.prefix +
          $scope.questions[0].id +
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
        $scope.responses[id] = $scope.questions[0].timeout;

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


    /////////////////////////
    // Page flip functions //
    /////////////////////////



    $scope.on_after_flip = function(direction)
    {
      $scope.update_button_label();
    }


    $scope.is_next_allowed = function()
    {
      if($scope.questions[0].type == "listen_sentence")
      {
        // Do not allow if playing sound
        if($scope.prefix + $scope.questions[0].id + '.playing' in $scope.responses) {
          if($scope.responses[$scope.prefix + $scope.questions[0].id + '.playing'] == true)
            return false;
        }

        // Only allow if played at least once
        if(!($scope.prefix + $scope.questions[0].id + '.play_count' in $scope.responses))
          return false;

        if($scope.responses[$scope.prefix + $scope.questions[0].id + '.play_count'] < 2)
          return false;
      }

      // Enable next if timer expired
      if($scope.get_timer_value() <= 0)
        return true;

      // Only enable next if question has been answered
      for(var i = 0; i < $scope.questions.length; i++) {
        var id = $scope.prefix + $scope.questions[0].id + '.' + $scope.questions[0].type;

        if($scope.questions[0].type == 'write_sentence' && !(id in $scope.responses))
          return false;
      }

      return true;
    }

  }
]);
