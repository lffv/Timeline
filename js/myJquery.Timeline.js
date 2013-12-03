/*!
 * MyjqueryTimeline Plugin
 *
 */
;
(function($) {
	
	
	
	var pluginName = 'myJqueryTimeline',
		defaults = {
			startYear : (new Date()).getFullYear() -1 , // Start with one less year by default
			numYears : 4,
			showToolTip : true,
			events : [],
			click : null //Handler for click event for event
		};
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var shortMonths = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

	function myJqueryTimeline(element, options) {
		this.options = $.extend({}, defaults, options);
		this._name = pluginName;
		this._el=$(element);
		this._timelineArea;
		this._yearsEl;
		this._monthsEl;
		this._eventsEl=new Array();
		this._tooltipEl;
		this._eventsOver=new Array();
		this._maxOver;
		//gapMonth= 100%/(12meses * Nr anos) 
		this.options.gapMonth=100/(12*this.options.numYears);
		//console.log(this.options.gapMonth);
		this.init();
		
	}

//INIT DA TIMELINE
	myJqueryTimeline.prototype.init = function() {	
		importFiles();
		
		var timeline=this;
		
		this.getSimultaneosEvents();
		//Desenha timeline
		this.drawTimeline();
		//Desenha Years and Save elms in _yearsEl
		this._yearsEl=timeline.drawYears();
		
		this._yearsEl=timeline.drawYearsTags();
		
		this._yearsEl=timeline.drawMonths();
		
		this._yearsEl=timeline.drawMonthsTags();
		
		this._eventsEl=timeline.drawEvents();
		
		
		if(timeline.options.click){
			this.addeventsListeners();
			
			}
		
			
	};
	myJqueryTimeline.prototype.addeventsListeners=function(){
		var _this=this;
		_this._eventsEl.map(
			function( elm, ind ) {
				elm.obj.on('click',function(e){
					var tgt=e.target;
					if(!$(tgt).hasClass("tooltipTime")){
						var $t = _this.getEventEl($(e.target));
						
						if($t.obj.hasClass('eventBar') ){
							//console.log($(e.target).attr("evt"));
							var evento=_this.getEvent($(e.target).attr("evt"));
							//console.log(evento);
							_this.options.click(e,evento);	
						}
						if($(tgt).hasClass("evtTitle")){
							$(tgt).siblings().map(cleanTooltip);
							
							$(tgt).toggleClass("active");
						}
					}
					
					});
	        	});
	}
	
	function importFiles(){
		var imported = document.createElement('script');
		imported.src = 'js/jquery.hoverIntent.js';
		document.head.appendChild(imported);	
	}
	
	function cleanTooltip(ind,el){
		if($(el).hasClass("active"))$(el).toggleClass("active");
	}
//DESENHA A LINHA PRINCIPAL DA TIMELINE QUE OCUPA 100% DO ELEMENTO PAI
	myJqueryTimeline.prototype.drawTimeline=function(){
		var _this=this;
		//cria elemento da linha principal
		_this._timelineArea=$("<div class='timeline'></div>");
		var dftHeight=_this._timelineArea.height();
		
		_this._timelineArea.height(dftHeight+(_this._maxOver*20));
		// faz append no elemento enviado por parametro para o construtor
		//_this.addEventListner(_this._timelineArea,'resize');
		
		/*
		_this._timelineArea.trigger($.Event('resize'));
		console.log(_this._timelineArea);
		_this._timelineArea.bind('resize', function(e) {
   			console.log(e);
		});
		*/
		_this._el.append(_this._timelineArea);
		
		
		
	};
	
	
	
	
	
	myJqueryTimeline.prototype.getSimultaneosEvents=function(){
		var _this=this;
		
		var dts=new Array();
		var dta={};
		$(_this.options.events).each(
			function(ind,it){
				dts.push({
					type:"s",
					id:it.id,
					start:it.start,
				});
				dts.push({
					type:"e",
					id:it.id,
					start:it.end,
				});		
			
		});
		dts.sort(compareDate);
		//console.log(dts);
		var ct=0,max=0,tot=0;
		var ret=new Array();
		var ret2=new Array();
		$(dts).each(
			function(ind,it){
				if(it.type=="s"){
					//if(ct>0){tot++;console.log(it);}
					ct++;
				}else{
					ct--;
				}
				if(ct>0){
					
					ret.push(it.id);
				}
				else{
					ret2.push(ret);
					ret=new Array();
				}
				//console.log(ret);
			});
			//console.log(ret2);
		//return (ret2);
		_this.removeEquals(ret2);
		_this.getMaxEventsOver();
	};
	
	
	myJqueryTimeline.prototype.getMaxEventsOver=function(){
		var _this=this;
		var max=0;
		$(_this._eventsOver).each(function(ind,it){
			if(it.length>max)max=it.length;
		});
		_this._maxOver=max;
	};
	
	myJqueryTimeline.prototype.removeEquals=function(ar){ 
		var _this=this;
		
		$(ar).each(function(ind ,it){
			var ret= new Array();
			$(it).each(function(ind1,it1){
					//console.log(it1);
					var flag=true;
					for(var i=0;i<ret.length && flag;i++){
						if(it1==ret[i])flag=false;
					}
					 if(flag)ret.push(it1);
					 
				});
				_this._eventsOver.push(ret);
				//ar[ind]=ret;
				console.log(ret);	
			});
		
		return ar;
	}
	
//DESENHA AS BARRAS CORRESPONDENTES AOS ANOS
	myJqueryTimeline.prototype.drawYears = function(){
		var _this=this;
		var _yearMark;
		//calcula espaço entre anos para vários tamanhos de display
		var _gap= 100/_this.options.numYears;
		var _yearsPos=new Array();
		var i;
		_yearMark=$("<div class='initial horizontal-line-year' ></div>");
		_yearMark.css("width",_gap+"%");
		_yearsPos.push({"pos":i*_gap,"obj":_yearMark});
		_this._timelineArea.append(_yearMark);
		//Para cada ano passados nas options é desenhada uma linha
		for(i=1;i<_this.options.numYears;i++){
			_yearMark=$("<div class='horizontal-line-year' ></div>");
			_yearMark.css("margin-left",(i*_gap)+"%");
			_yearMark.css("width",_gap+"%");
			//Push no array das posicoes das barras verticais dos anos
			//passa objs tipo {pos:posicao da linha  ,  obj: objectos jquery com linha do ano} 
			_yearsPos.push({"pos":i*_gap,"obj":_yearMark});
			
			_this._timelineArea.append(_yearMark);
		}
		//desenha a ultima linha que termina a timeline
		_yearMark=$("<div class='end horizontal-line-year'></div>");
		_yearMark.css("margin-left",100+"%");
		
		//Push no array das posicoes das barras verticais dos anos
		//passa objs tipo {pos:posicao da linha  ,  obj: objectos jquery com linha do ano} 
		_yearsPos.push({"pos":(_this._timelineArea.width()-3),"obj":_yearMark});
		
		_this._timelineArea.append(_yearMark);
		//retorna array com pos para colocar tags dos anos
		var dftHeight=$(".horizontal-line-year").height();
		$(".horizontal-line-year").height(dftHeight+(_this._maxOver*20));
		
		return _yearsPos;
	};
	
	myJqueryTimeline.prototype.drawYearsTags=function(){
		var _this=this;
		
		
		var _yearTag;
		
		var i;
		for(i=0;i<_this.options.numYears+1;i++){
			_yearTag=$("<div class='yearTag'>"+parseInt(_this.options.startYear+i)+"</div>");
			_this._yearsEl[i].obj.append(_yearTag);
			
		}
		return _this._yearsEl;
	};
	
	myJqueryTimeline.prototype.drawMonths= function(){
		var _this=this;
		var _monthMark;
		var _gap=100/12;
		var _monthsEl;
		var j;
		for(var i=0;i<_this.options.numYears;i++){
			_monthsEl=new Array();
			for( j=0;j<12;j++){
				j==0 ? _monthMark=$("<div class='horizontal-line-month first' style='border-style: none none none none;' id='"+months[j]+"'></div>") : _monthMark=$("<div class='horizontal-line-month' id='"+months[j]+"'></div>");
				_monthMark.css("left",(j*_gap)+"%");
				
				
				
				_monthsEl.push({"pos":(j*_gap)+"%","obj":_monthMark});
				_this._yearsEl[i].obj.append(_monthMark);
					
			}
			_this._yearsEl[i].months=_monthsEl;
		}
		var dftHeight=$(".horizontal-line-month").height();
		$(".horizontal-line-month").height(dftHeight+(_this._maxOver*20));
		return _this._yearsEl;
	};
	
	
	myJqueryTimeline.prototype.drawMonthsTags=function(){
		var _this=this;
		$(_this._yearsEl).each(function(ind,it){
			$(it.months).each(function(ind1,it1){
				
				if(_this.options.gapMonth<1){
					
					var _monthTag=$("<div class='monthTag mini' data='"+ind1+"' >"+shortMonths[ind1]+"</div>");
					ind1%2==0 ?_monthTag.addClass("odd"):_monthTag.addClass("even");
					it1.obj.append(_monthTag);
				}else{
					var _monthTag=$("<div class='monthTag' data='"+ind1+"'>"+months[ind1]+"</div>");
					
					it1.obj.append(_monthTag);
				}
				//_this.addEventListner(_monthTag,"mouseover");
				//_this.addEventListner(_monthTag,"mouseleave");
				
			});
		});
		return _this._yearsEl;
		
	};
	
	myJqueryTimeline.prototype.drawEvents=function(){
		var _this=this;
		$(_this._eventsOver).each(
			function(i,item){
				$(item).each(function(ind,it){
					_this.drawEvent(_this.getEvent(it),ind);	
				});
				
				
			}
		);
		/*
		$(_this.options.events).each(function(ind,it){
			_this.drawEvent(it,ind);
		});
		*/
		return _this._eventsEl;
	};
	
	
	myJqueryTimeline.prototype.drawEvent=function(it,ind){
		var _this=this;
		if(_this.checkDate(it.start,it.end)){
				var mult=0.4;
				var _posWidth=_this.getEventPositionWidth(it.start,it.end);
				var _eventBar={};
				_eventBar.start=_posWidth.start;
				_eventBar.end=_posWidth.end;
				_eventBar.obj=$("<div class='eventBar' evt='"+it.id+"'></div>").css("left",(_posWidth.start*_this.options.gapMonth)+"%");
				_eventBar.obj.css("width",(_posWidth.end*_this.options.gapMonth)+"%");
				_eventBar.obj.css("margin-left","2px");
				_eventBar.obj.css("margin-top", 100-(ind*20));
				//console.log(_eventBar.css("left").split("%")[0]);
				//_eventBar.css("margin-left",_eventBar.css("margin-left").split("%")[0]+2+"px");
				_this.addEventListner(_eventBar.obj,"click");
				_this.addEventListner(_eventBar.obj,"hover");
				//_this.addEventListner(_eventBar.obj,"mouseover");
				//_this.addEventListner(_eventBar.obj,"mouseleave");
				
				_this._eventsEl.push(_eventBar);
				
				_this._timelineArea.append(_eventBar.obj);	
			}
	};
	
	
	myJqueryTimeline.prototype.getEventPositionWidth=function(start,end){
		var _this=this;
		var _ret={};
		var i;
		for(i=0;i<_this.options.numYears;i++){
			if((start.getFullYear()==_this.options.startYear+i)){
				_ret.start=((i*12)+(start.getMonth()));
			}
			if((end.getFullYear()==_this.options.startYear+i)){
				_ret.end=((i*12)+(end.getMonth()))-_ret.start;
				//_ret.end=((i*12)+(start.getMonth()-1))-_ret.start;
			}
			
			
		}
		//console.log(_ret);
		return _ret;
		
		
	};
	
	
	
	myJqueryTimeline.prototype.addEventListner = function($retHtml,sEvent){
		var _this = this;
		
		if(sEvent=='hover'){
			$retHtml.hoverIntent({
				over:function(e){
					var _target=$(e.target);
					
					if(_target.hasClass("eventBar")  ){
						
					
						var _tgt=_this.getEventEl(_target);
						//console.log(_tgt.obj.attr("evt"));
						
						if(_tgt.obj.find(".tooltipTime").length==0){
							
							//var evento=_this.options.events[_tgt.obj.attr("evt")];
							var evento;
							
							var p;
							var evtSelect=$(".eventBar.active").attr("evt");
							if(!evtSelect)evtSelect=-1;
								//console.log(evtSelect);
							var offset=_tgt.obj.offset();
						
							var _tooltipEl=$("<div class='tooltipTime' ></div>");
							
							 /*
							
							var _evts=_this.getNearEvents(_tgt);
							$(_evts).each(function(ind,it){
								
								evento=_this.options.events[it.obj.attr("evt")];
								p=$("<p class='evtTitle' evt='"+evento.id+"'>"+evento.title+"</p>");
								if(evtSelect>(-1) && evento.id==evtSelect)p.addClass("active");
								
								_tooltipEl.append(p)
								//_tooltipEl.append("<div class='tooltipTimeTitle' evt='"+evento.id+"'>"+evento.title+"</div>");
							});
							*/
							evento= _this.getEvent(_tgt.obj.attr("evt"));
								//_tooltipEl.append("<div class='tooltipTimeTitle' evt='"+evento.id+"'>"+evento.title+"</div>");
								p=$("<p class='evtTitle' evt='"+evento.id+"'>"+evento.title+"</p>");
								if(evtSelect>(-1) && evento.id==evtSelect)p.addClass("active");
								_tooltipEl.append(p)

							console.log(_tgt.obj.width());
							_tooltipEl.css("left",-64+(_tgt.obj.width()/2));
							//console.log($(_evts).size());
							
							//console.log($(_tooltipEl).height());
							//$(_evts).size()==1?;
							
							//45*eventos
							//var a=$(_evts).size()+1;
							
							//_tooltipEl.css("top",(-25*a)-38)
							_tooltipEl.css("top",(-25)-38)
							//console.log(_tooltipEl.css("top",(-50*($(_evts).size()))-30));
							
							//_this.addEventListner(_tooltipEl,"mouseleave"); 
							
							_tgt.obj.append(_tooltipEl);
							_tooltipEl.fadeIn();
						}
					
						//console.log(_evts);
						
						
						
						
						
						
						/*
						var evento=_this.options.events[_tgt.obj.attr("evt")];
						var offset=_tgt.obj.offset();
						
						if(_tgt.obj.find(".tooltipTime").length==0){
							var _tooltipEl=$("<div class='tooltipTime' ></div>");
							_tooltipEl.append("<div class='tooltipTimeTitle' evt='"+evento.id+"'>"+evento.title+"</div>");
							_tooltipEl.append("<div class='tooltipTimeArrow' >&nbsp;</div>");
							_tooltipEl.css("left",e.pageX-offset.left-50);
							
							_this.addEventListner(_tooltipEl,"mouseleave"); 
							
							_tgt.obj.append(_tooltipEl);
							_tooltipEl.fadeIn();
							
						}
						*/
					}
					if(_target.hasClass(["monthTag"])  ){
						_target.html(months[_target.attr("data")]);
						
					}
				},
				out:function(e){
					var _target=$(e.target);
				
					e.stopImmediatePropagation();
					if(_target.hasClass("eventBar")){
						var _tgt=_this.getEventEl(_target);
						_tgt.obj.find(".tooltipTime").fadeOut(100);
						setTimeout(function(){
							_tgt.obj.find(".tooltipTime").remove();		
						},300);
					}
					
					if(_target.hasClass("tooltipTime") ){
						
						_target.fadeOut(100);
						
					}
					
					if(_target.hasClass("monthTag")  ){
						_target.html(_target.html().charAt(0));
						
					}
				},
				timeout:300,
			});
		
		};
		if(sEvent == 'mouseover'){
			$retHtml.mouseover( 
				function(e){
					//get id elemente
					
					
					//get event from array
					
					
				}
			);
		}
		if(sEvent == 'mouseleave'){
			/*
			$retHtml.mouseleave(function(e){
				console.log(e.target);
				var _target=$(e.target);
				
				e.stopImmediatePropagation();
					if(_target.hasClass("eventBar")){
						var _tgt=_this.getEventEl(_target);
						_tgt.obj.find(".tooltipTime").fadeOut(100);
						setTimeout(function(){
							_tgt.obj.find(".tooltipTime").remove();		
						},300);
					}
					
					if(_target.hasClass("tooltipTime") ){
						
						_target.fadeOut(100);
						
					}
					
					if(_target.hasClass("monthTag")  ){
						_target.html(_target.html().charAt(0));
						
					}
					
				
				
			});
			*/
		}
		if(sEvent == 'click'){
		// Attach a click event handler to event objects
			$retHtml.click(function(e){
				console.log($(".eventBar"));
				if(!$(e.target).hasClass("tooltipTime")){
					var _tgt=_this.getEventEl($(e.target));
					e.stopPropagation();
					
					if(_tgt.obj.hasClass("eventBar")){
						var _actTgt=_this.getEventElActive();
						if(_actTgt){
							_actTgt.obj.toggleClass("active");	
						}
						
						//console.log(_this._eventsEl.find(".active"));
						_tgt.obj.toggleClass("active");
						
					}
					
					//console.log(_tgt);	
				}
				
			});
		}	
	};
	
	
	myJqueryTimeline.prototype.getNearEvents=function(tgt){
		var _this=this;
		//console.log(tgt);
		var _ret=new Array();
		$(_this._eventsEl).each(function(i,it){
			
			if(tgt.obj!=it.obj){
				//console.log(it.start, (it.start+it.end),tgt.start, tgt.start+tgt.end);
				if(it.start>tgt.start && it.start<(tgt.start+tgt.end)){
					_ret.push(it);
				}
				if((it.start+it.end)>tgt.start && (it.start+it.end)<(tgt.start+tgt.end)){
					_ret.push(it);
				}
			}
		});
		return _ret;
	}
	
	
	myJqueryTimeline.prototype.getEventEl=function(tgt){
		var _this=this;
		var _ret=null;
		$(_this._eventsEl).each(function(ind,it){
			if(it.obj.attr("evt")===tgt.attr("evt")){
				_ret=it;
			}
		});
		return _ret;
	}
	myJqueryTimeline.prototype.getEventElActive=function(){
		var _this=this;
		var _ret=null;
		$(_this._eventsEl).each(function(ind,it){
			if(it.obj.hasClass("active")){
				_ret=it;
			}
		});
		return _ret;
	};
	
	myJqueryTimeline.prototype.drawToolTip=function(tgt,evento){
		var _this=this;
			
			var _tooltipEl=$("<div class='tooltipTime' evt='"+evento.id+"'></div>");
			_tooltipEl.append("<div class='tooltipTimeTitle'>"+evento.title+"</div>");
			_tooltipEl.append("<div class='tooltipTimeArrow'>&nbsp;</div>");
			
			
			
		//$(".tooltipTimeTitle").html(evento);

	};
	myJqueryTimeline.prototype.removeToolTip=function(){
		var _this=this;
		setTimeout(
			function(){}
		);
			_this._el.find(".tooltipTime").fadeOut();
			_this._el.find(".tooltipTime").remove();
		
	};
	
	myJqueryTimeline.prototype.checkDate=function(start,end){
		var _this=this;
		if(start.getFullYear()>=_this.options.startYear && end.getFullYear()<_this.options.startYear+_this.options.numYears){
			if(start.getFullYear()<end.getFullYear()){
				return true;
			}
			if(start.getFullYear()==end.getFullYear()){
				if(start.getMonth()<end.getMonth()){
					//console.log(start.getMonth(),end.getMonth());
					return true;
				}
			}
		}
		return false;
	};
	
	myJqueryTimeline.prototype.getAllEvents2 = function(){
		var _this = this;
		var retArr = [];
		$(_this.options.events).each(function(){
			retArr.push(this);
		});
		return retArr;
	};
	
	myJqueryTimeline.prototype.removeEvents = function(eIds){
		var _this = this;
		
		$(eIds).each(function(ind,it){
			_this.options.events[it]=null;
			_this.options.events=copyDeep(_this.options.events);
			var a=_this._timelineArea.find($(".eventBar"));
			
			$(a[it]).remove();
			
			
			_this._eventsEl[it]=null;	
			_this._eventsEl=copyDeep(_this._eventsEl)
			
		});
		
	};
	
	myJqueryTimeline.prototype.getEvent=function(id){
		var _this=this;
		var _ret=null;
		$(_this.options.events).each(function(ind,it){
			if(it.id==id) ret=it;	
		});
		return ret;
	};
	
	myJqueryTimeline.prototype.addEvents=function(evts){
		var _this=this;
		var _org=new Array();
		var _flag=true;
		var _evtsAct=_this.options.events;
		$(evts).each(function(ind,it){
			_this.options.events.push(it);
			_this.drawEvent(it);
			_this.addeventsListeners();
		});
		_this.options.events.sort(compareDate);
		//console.log(_this.options.events);
		
		/*
			_this.drawEvent(it);
			_this.options.events=org;
		*/
	};
	
	function compareDate(a,b){
		return(a.start>b.start);
	}
	
	function copyDeep(arr){
		var ret=new Array();
		$(arr).each(function(ind,it){
			if(it!=null)ret.push(it);
		});
		return ret;
	}
	
	
	
	
	$.fn.myJqueryTimeline = function(options) {
		return this.each(function() {
			var element=$(this);
			var timeline = new myJqueryTimeline(this, options);
			
			element.data('myJquerytimeline', timeline);
			
			
		});
	};
	
	
}(jQuery, window));

	