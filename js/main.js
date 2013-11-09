$(function(){
	

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
		];
	
					
			var tl = $('#myTimeline').myJqueryTimeline({
							events : events,
							numYears:9,
							startYear:2005,
							click:function(e,event){
								$(".teste").html(event.title);
							}
						});
	


	

	
});