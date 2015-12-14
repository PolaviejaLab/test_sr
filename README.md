
Sentence reconstruction
=======================

See e.g. Clement, 2013

 
Overview
--------
 
In the sentence reconstruction task an audio fragment
with noise is presented to individual participants
and they estimate the content of the sentence
individually. Then they move to the group computer
and give a joint estimate of the sentence contents.


Screens
-------

<table>
	<tr>
		<th>Central</th> <th>Message</th> <th>Peripheral</th>
	</tr>
	
	<tr>
		<td>Go to individual computer</td> <td></td> <td>Listen to sentence</td>
	</tr>
	
	<tr>
		<td></td> <td>SRc/Waiting &#8608;</td> <td></td>
	</tr>
	
	<tr>
		<td></td> <td></td> <td>Write sentence</td>
	</tr>
	
	<tr>
		<td></td> <td>&#8606; SRp/Complete</td> <td></td>
	</tr>
	
	<tr>
		<td>Wait for group</td> <td></td> <td>Wait for group</td>
	</tr>
	
	<tr>
		<td></td> <td>SRc/Started &#8608;</td> <td></td>
	</tr>
	
	<tr>
		<td>Write sentence</td> <td></td> <td>Go to group computer</td>
	</tr>
	
	<tr>
		<td></td> <td>SRc/Complete &#8608;</td> <td></td>
	</tr>
</table>

 
Communication
-------------

Communication between the central and peripheral
devices will occur over a messaging channel named
after the group. For example if the ParticipantID is
MyGroup_MyName_T1, then MyGroup will be the channel.

JSON messages are exchanged to coordinate the devices.  
Messages must have the following field:

 * task: "SRc" for central or "SRp" for peripheral
 * withinGroupId: "" for central or "T1" .. "T3" for peripheral
 * trial: Number of the current trial
 * status: See below

The status field can have the following values:
  * "complete": Central computer signals start of next trial. Peripheral devices signal completion of trial.
  * "waiting": Central computer signals it is ready. Peripheral devices are waiting for participant.
 

Storage
-------

The trial results will be stored under key "SR.[TrialNr]".

In case of the central computer, the list of devices that
have finished the trial is available under key 
"SR.Central.[TrialNr].Ready".

In case of the peripheral devices, whether the answer is final
will be recorded under "SR.Peripheral.[TrialNr].IsFinal".* 
