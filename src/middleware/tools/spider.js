
		var stringSpacing = 18.8;
		var stringOffset = -3.5;
		
		
		var tempo = parent.thePlayer.getPlayerSettings().getSpiderDrillsTempo();
		
		$('#tempo').val(tempo);
		
		var timerDelay = (60 / tempo) * 1000;
		
		var dotStrings = [1, 1, 1, 1];
		var dotDirections = [1, 1, 1, 1];
		var allCombinations = [];
		var selectedCombinations = [];
		
		var nRestCycle = 7;
		var bRestFinished = false;
		
		
		var bIsRunning = false;
		var bIsPaused = false;
		
		allCombinations.push([1, 2, 3, 4]);
		allCombinations.push([1, 2, 4, 3]);
		allCombinations.push([1, 3, 2, 4]);
		allCombinations.push([1, 3, 4, 2]);
		allCombinations.push([1, 4, 2, 3]);
		allCombinations.push([1, 4, 3, 2]);
		
		allCombinations.push([2, 1, 3, 4]);
		allCombinations.push([2, 1, 4, 3]);
		allCombinations.push([2, 3, 1, 4]);
		allCombinations.push([2, 3, 4, 1]);
		allCombinations.push([2, 4, 1, 3]);
		allCombinations.push([2, 4, 3, 1]);
		
		allCombinations.push([3, 1, 2, 4]);
		allCombinations.push([3, 1, 4, 2]);
		allCombinations.push([3, 2, 1, 4]);
		allCombinations.push([3, 2, 4, 1]);
		allCombinations.push([3, 4, 1, 2]);
		allCombinations.push([3, 4, 2, 1]);
		
		allCombinations.push([4, 1, 2, 3]);
		allCombinations.push([4, 1, 3, 2]);
		allCombinations.push([4, 2, 1, 3]);
		allCombinations.push([4, 2, 3, 1]);
		allCombinations.push([4, 3, 1, 2]);
		allCombinations.push([4, 3, 2, 1]);
		
		var bCountdownFinished = false;
		var nCountdownCycle = 8;
		
		var nCombinationIndex = 0;
		var nCombinationDotIndex = -1;
		
		var nStringIndex = 1;
		var nTimerID;
		var tickSound;
		var tockSound;
		
		$(function() {
		
			tickSound = new Howl({
			  src: ['/assets/audio/tick-sound.mp3']
			});
			
			tockSound = new Howl({
			  src: ['/assets/audio/tock-sound.mp3']
			});
		
			setKeyboardShortcuts();
			
			$(document).foundation();
			FastClick.attach(document.body);

			$('.comboCheckbox').change(function() {getCombinations();});



		});
		
		
		function tempoChanged()
		{
			let newTempo = $('#tempo').val();
			if( isNaN( newTempo ))
			{
				let tempoOverride = parent.thePlayer.getPlayerSettings().n_SpiderDrillsBPM;
				$('#tempo').val(tempoOverride);
			}
			else {
				parent.thePlayer.getPlayerSettings().setSpiderDrillsTempo(newTempo);
				parent.thePlayer.userDataManager.saveUserProPlayerData(true);
			}
				
		}
		/*****************************************
		************* Display  Update Functions  ************
		*****************************************/
		function moveDot( whichDot )
		{
			dotStrings[ whichDot ] += dotDirections[ whichDot ];
			if( dotStrings[ whichDot ] == 6 || dotStrings[whichDot] == 1)
			{
				dotDirections[ whichDot ] *= -1;
			}
			newTop = calculateTop( dotStrings[ whichDot ], whichDot );
			$('#dot'+ (whichDot+1)).css('top', newTop + 'px');
			
			newLeft = calculateLeft(whichDot);
			$('#dot'+ (whichDot+1)).css('left', newLeft + 'px');
			
		}
		
		function moveDotToString( whichDot, whichString )
		{
			newTop = calculateTop( whichString, whichDot );
			$('#dot'+ (whichDot+1)).css('top', newTop + 'px');
			
			
			newLeft = calculateLeft(whichDot);
			$('#dot'+ (whichDot+1)).css('left', newLeft + 'px');
		}
		
		function setDotStates( nOffset = 0 )
		{
			activeCombination = selectedCombinations[nCombinationIndex + nOffset];
			//$('.dot').fadeTo( 200, .5, function(){
				$('.dot').toggle(true);
				$('.first').toggleClass('first', false);
				$('.second').toggleClass('second', false);
				$('.third').toggleClass('third', false);
				$('.fourth').toggleClass('fourth', false);
				$('#dot'+activeCombination[0]).toggleClass('first');
				$('#dot'+activeCombination[1]).toggleClass('second');
				$('#dot'+activeCombination[2]).toggleClass('third');
				$('#dot'+activeCombination[3]).toggleClass('fourth');
			//	$('.dot').fadeTo( 800, 1.0 );
			//});
		}
		
		
		function setMessage( strMessage )
		{$('#message').html(strMessage);}
		
		
		function checkAll( bIsChecked )
		{
			$('#combinationSelector .checkbox').prop('checked', bIsChecked)
		}
		
		function checkSet( nIndex = 1, bChecked = true )
		{
			$('.finger-' + nIndex).prop('checked', bChecked);
			getCombinations();
		}
		
		function updateCombinations()
		{
			//nCurrentIndex = nCombinationIndex + 1;
			//nTotalCount = selectedCombinations.length;
			//if( nTotalCount > 0)
			//{
				
				setMessage( getformattedCombination( nCombinationIndex));
				/*
				if(nCurrentIndex < selectedCombinations.length)
				{
		 			//$('#nextUp').html('Next: &nbsp' + getformattedCombination( nCurrentIndex ));
		 			//$("#nextUp").fadeTo(200, 0.1).fadeTo(200, 1.0).fadeTo(200, .1).fadeTo(200, 1.0);
		 		}
		 		*/
		 	//}
		 	//else
		 //	{
			 	//$('#nextUp').html('');
			 	//$('#indexCount').html('');
		 //	}
		}
		
		function updateProgress()
		{
			nCurrentIndex = nCombinationIndex;
			nTotalCount = selectedCombinations.length;
			if( nTotalCount > 0)
			{
				comboPercentage = parseFloat( (nCurrentIndex / nTotalCount) * 100);
				stringPercentage = (nStringIndex - 1) * ((100 / nTotalCount) * .1);
				
				nPercent = comboPercentage + stringPercentage;
				$('#progressIndicator').css('width', nPercent + '%');
		
			}
		}
		
		/*****************************************
		*************  Utility Functions  ************
		*****************************************/
		
		
		function calculateTop( string, whichDot )
		{
			
			var dotIndex = whichDot+1;
			var dotHeight = $('#dot'+ dotIndex ).height();
			
			var stringTop = $('#string'+string).position().top;
			
			var offsetTop = stringTop - (dotHeight/2.0);
			return offsetTop;
		}
		
		function calculateLeft( whichDot )
		{
			
			dotIndex = whichDot + 1;
			
			rightFret = dotIndex + 2;
			leftFret = dotIndex + 1;
			
			
			leftSide = $('#fret'+leftFret).position().left;
			rightSide = $('#fret'+rightFret).position().left;
			
			
			gapWidth = rightSide - leftSide;
			centerLine = leftSide + (gapWidth / 2.0);
			
			dotWidth = $('#dot'+dotIndex).width();
			
			offsetLeft = centerLine - (dotWidth / 2.0);
			
			return offsetLeft;
			
		}
		
		function playClick( tickOrTock )
		{
			if(tickOrTock == 0)
			{tickSound.play();}
			else
			{tockSound.play();}
		}
		
		function getCombinations()
		{
			selectedCombinations = [];
			checkboxes = $('#combinationSelector .comboCheckbox');
			for( i = 0; i < checkboxes.length; i++)
			{
				if( $(checkboxes[i]).prop('checked') )
				{
					selectedCombinations.push( allCombinations[i] );
				}
			}
			comboCount = selectedCombinations.length;
			$('#combinationCount').html('(' + comboCount + ')');
			$('#play').prop('disabled', comboCount == 0);
			
		}
		
		function getformattedCombination( nIndex = 0)
		{
			if( nIndex > selectedCombinations.length - 1)
			{
				return '';
			}
			strCombination = '';
			for( i = 0; i < 4; i++)
			{			
				strCombination += selectedCombinations[nIndex][i];
				if(i != 3)
				{	
					strCombination += ' - ';
				}
			}
			return strCombination;
		}
		
		
		function toggleSidebar()
		{$('#pageWrapper').toggleClass('split');}
		
		
		/*****************************************
		*************  Control Functions  ************
		*****************************************/
		function toggleRun()
		{
			if( !bIsRunning )
			{run();}
			else
			{pause();}
			
		}
		
		function run()
		{	
			
			//retrieve the list of combinations
			getCombinations();
			if( selectedCombinations.length == 0)
			{return;}
			if(initialize())
			{
				bIsRunning = true;
				bCountingDown = true;
				nCountdownCycle = 7;
				isCountingDown = true;
				
				updateProgress();
				updateControls();
				
				nTimerID = setInterval(function () {updateCallback();}, timerDelay);
			}
			
		}
		
		function initialize()
		{
			
			//calculate tempo
			tempo = $('#tempo').val();
			
			if( isNaN( tempo ))
			{
				alert("Tempo must be a number.");
				return false;
			}
			
			tempo = Math.max(10, tempo);
			tempo = Math.min( 400, tempo);
			timerDelay = (60 / tempo) * 1000;
			

			$('#combinationSelector .checkbox').prop( 'disabled', true);
			
			//retrieve the list of combinations
			getCombinations();
			
			//update the dots to match the first combination.
			setDotStates();
			
			
			
			moveDotToString( 0, 1 );
			moveDotToString( 1, 1 );
			moveDotToString( 2, 1 );
			moveDotToString( 3, 1 );
			
			
			//setup the countdown cycle
			nCountdownCycle = 7;
			nRestCycle = 7;
			return true;
				
		}
		
		function updateControls()
		{	
			$('#play').prop('disabled', bIsRunning);
			$('#stop').prop('disabled', !bIsRunning);
			$('#tempo').prop('disabled', bIsRunning);
			$('#combinationsToggle').prop('disabled', bIsRunning);
		}
		
		function stop()
		{
			clearInterval(nTimerID);
			bIsPaused = false;
			bIsRunning = false;
			$('#combinationSelector .checkbox').prop( 'disabled', false);
			nTimerID = 0;
			reset();
			setMessage( '' );
			updateControls();
		}
		
		function reset()
		{
			AdotStrings = [1, 1, 1, 1];
			dotDirections = [1, 1, 1, 1];
			nCombinationIndex = 0;
			nCombinationDotIndex = -1;
		
			nStringIndex = 1;
			selectedCombinations = [];
			
			nRestCycle = 7;
			bRestFinished = false;
			nCountdownCycle = 7;
			bCountdownFinished = false;
			
			
			moveDotToString( 0, 1 );
			moveDotToString( 1, 1 );
			moveDotToString( 2, 1 );
			moveDotToString( 3, 1 );
			
			$('.first').toggleClass('first', false);
			$('.second').toggleClass('second', false);
			$('.third').toggleClass('third', false);
			$('.fourth').toggleClass('fourth', false);
			$('.dot').toggle(false);
			setMessage( "" );
			updateCombinations();
		}
		
		
		
		function pause()
		{
			$('#play').html('<i class="fa fa-play"></i>');
			$('#play').toggleClass('active', false);
			bIsPaused = true;
			bIsRunning = false;
			clearInterval( nTimerID );	
		}
		
		
		/*****************************************
		*************  Callback Functions  ************
		*****************************************/
		function updateCallback()
		{
			//Determine if we are counting down
			if( !bCountdownFinished )
			{
				// The countdown has not been finished, 
				
				if(nCountdownCycle == 0)
				{
					
					let messageString = 'Get Ready... ' + (nCountdownCycle + 1);
					messageString += "<br/><small>Next: " + getformattedCombination( nCombinationIndex + 1) + "</small>";
					setMessage( messageString );
					playClick( nCountdownCycle == 7 || nCountdownCycle == 3 ? 0 : 1 );
					// We've reached the end of the countdown.
					bCountdownFinished = true;
					nCountdownCycle = 7;
					if(nCombinationIndex == -1)
					{
						nCombinationIndex == 0;
					}
					return;
				}
				else
				{
					// We're still counting down, update the status
					let messageString = 'Get Ready... ' + (nCountdownCycle + 1);
					if( nCombinationIndex == 0)
					{
						messageString += "<br/><small>Start With: " + getformattedCombination( nCombinationIndex ) + "</small>";
					}
					else
					{
						messageString += "<br/><small>Next: " + getformattedCombination( nCombinationIndex + 1) + "</small>";
					}
					setMessage( messageString );
					playClick( nCountdownCycle == 7 || nCountdownCycle == 3 ? 0 : 1 );
					nCountdownCycle--;
					return;
				}
			}
			else
			{
				// Countdown is over, now we're moving dots
				
				// Have we moved all the dots onto the current string?
				// (This matters because we don't really have to do much if we haven't)	
				if( nCombinationDotIndex < 3 )
				{
					nCombinationDotIndex++;
					
					// No, all the dots are not yet onto this string. 
					if( nStringIndex == 1 && nCombinationDotIndex == 0)
					{
						$('body').toggleClass('resting', false);
						updateCombinations();
					}
				}
				else
				{
					// Yes, all the dots are on this string.
					
					// Are we on the last string?
					if( nStringIndex == 10)
					{
						// Yes, we are on the last string
						
						// Is this the last combination in the list?
						if(nCombinationIndex == selectedCombinations.length - 1)
						{
							// Yes, this is the final combination, and we have finished the final string . We are done.
							
							updateProgress();
							$('#progressIndicator').css('width', '100%');
							nStringIndex = 0;
							nCombinationIndex = 0;
							nCombinationDotIndex = 0;
							clearInterval(nTimerID);
							stop();
							setMessage( 'Done' );
							return;
						}
						else if (nCombinationIndex < selectedCombinations.length - 1)
						{
							// No, this is not the last combination, but we have reached the last string.
							// At this point we need to initiate a rest, and when that rest is over, advance to 
							// the next combination.
							
							
							// Determine if we should be resting
							if( !bRestFinished )
							{
								// Our rest is not finished.
								
								if( nRestCycle == 0 )
								{	
									// Our rest is finished.
									var restString = "Rest... " + (nRestCycle + 1);
									restString += "<br/><small>Next: " + getformattedCombination( nCombinationIndex + 1) + "</small>";
									setMessage( restString );
									playClick( 1 );
									bRestFinished = true;
									nRestCycle = 7;
									return;
								}
								else
								{	
									if( nRestCycle == 7)
									{
										setDotStates( 1 );
										$('body').toggleClass('resting', true);
									}
									playClick( (nRestCycle == 7 || nRestCycle == 3) ? 0 : 1 );
									var restString = "Rest... " + (nRestCycle + 1);
									restString += "<br/><small>Next: " + getformattedCombination( nCombinationIndex + 1) + "</small>";
									setMessage( restString );
									
									nRestCycle--;
									return;
								}
								
							}
							else
							{
								// The rest has finished, let's reset it. We won't hit this again until it's time to rest again.
								bRestFinished = false;
								nRestCycle = 7;
								$('body').toggleClass('resting', false);
								
								// Now we advance the combination index.
								nCombinationIndex++;
								
								// Display information about the new combination.
								updateCombinations();
								
								// Advance us to the next string
								nStringIndex = 1;
								
								// Start the dot count over
								nCombinationDotIndex = 0; 
								
								updateCombinations();
							}
						}
					}
					else if (nStringIndex < 10)
					{
						// We've hit the last dot, but we're not on the last string.
						nStringIndex++; 
						updateProgress();
						nCombinationDotIndex = 0;
					}
				}
				
				whichDot = selectedCombinations[nCombinationIndex][nCombinationDotIndex] - 1;
				playClick(nCombinationDotIndex);
				moveDot(whichDot);
			}
		}
		
		function setKeyboardShortcuts()
		{
			Mousetrap.bind('space', function(){toggleRun()});
			Mousetrap.bind('s', function(){toggleSidebar()});
		}

    