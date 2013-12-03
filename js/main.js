$(function(){
	
	  	

	var evts=[
			{
					id:4,
					title:"title4",
					start:new Date(2010,3,15),
					end:new Date(2011,5,15)
			},
			{
					id:5,
					title:"title5",
					start:new Date(2011,3,15),
					end:new Date(2012,5,15)
			}
			
	];
	var events=[
			{
					id:0,
					title:"title0",
					start:new Date(2006,3,15),
					end:new Date(2007,5,15)
			},
			{
					id:1,
					title:"title1",
					start:new Date(2008,2,15),
					end:new Date(2009,5,15)
			},
			{
					id:2,
					title:"title2",
					start:new Date(2008,5,15),
					end:new Date(2010,6,15)
			},
			{
					id:3,
					title:"title3",
					start:new Date(2012,2,15),
					end:new Date(2013,5,15)
			},
			{
					id:4,
					title:"title4",
					start:new Date(2010,3,15),
					end:new Date(2011,5,15)
			},
			{
					id:5,
					title:"title5",
					start:new Date(2011,3,15),
					end:new Date(2012,5,15)
			}
		];
	
					
			var tl = $('#myTimeline').myJqueryTimeline({
							events : events,
							numYears:8,
							startYear:2006,
							click:function(e,event){
								
								$(".teste").html(event.title);
							}
						});
						
			
		var cenas=$('#myTimeline').data('myJquerytimeline');
		//cenas.addEvents(evts);
		console.log(cenas);
	
	$(window).change(function(){alert("change");});
	

	
	
});