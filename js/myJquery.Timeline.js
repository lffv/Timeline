/*!
 * jqtimeline Plugin
 * http://goto.io/jqtimeline
 *
 * Copyright 2013 goto.io
 * Released under the MIT license
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
	months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	shortMonths = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

	function myJqueryTimeline(element, options) {
		this.options = $.extend({}, defaults, options);
		this._name = pluginName;
		this._el=$(element);
		this._timelineArea;
		this._yearsEl;
		this._monthsEl;
		this._eventsEl=new Array();
		this._tooltipEl;
		//gapMonth= 100%/(12meses * Nr anos) 
		this.options.gapMonth=100/(12*this.options.numYears);
		//console.log(this.options.gapMonth);
		this.init();
		
	}

//INIT DA TIMELINE
	myJqueryTimeline.prototype.init = function() {	
		var _this=this;
		//Desenha timeline
		this.drawTimeline();
		//Desenha Years and Save elms in _yearsEl
		this._yearsEl=_this.drawYears();
		
		this._yearsEl=_this.drawYearsTags();
		
		this._yearsEl=_this.drawMonths();
		
		this._yearsEl=_this.drawMonthsTags();
		
		this._eventsEl=_this.drawEvents();
		
		
		if(_this.options.click){
			this._eventsEl.map(
			function( elm, ind ) {
				elm.obj.on('click',function(e){
					var $t = _this.getEventEl($(e.target));
					if($t.obj.hasClass('eventBar')){
						//console.log(_this.getEventEl($t));
						_this.options.click(e,_this.options.events[$t.obj.attr("evt")]);	
					}
					});
	        	});
			}
		
		//this._el.on("change",function(){alert("aa");});
		
		
			
	};
//DESENHA A LINHA PRINCIPAL DA TIMELINE QUE OCUPA 100% DO ELEMENTO PAI
	myJqueryTimeline.prototype.drawTimeline=function(){
		var _this=this;
		//cria elemento da linha principal
		_this._timelineArea=$("<div class='timeline'></div>");
		// faz append no elemento enviado por parametro para o construtor
		_this._el.append(_this._timelineArea);
		//Desenha agora as barras correspondentes dos anos 
		
		
		
	};

//DESENHA AS BARRAS CORRESPONDENTES AOS ANOS
	myJqueryTimeline.prototype.drawYears = function(){
		var _this=this;
		var _yearMark;
		//calcula espaço entre anos para vários tamanhos de display
		var _gap= 100/_this.options.numYears;
		var _yearsPos=new Array();
		//Para cada ano passados nas options é desenhada uma linha
		for(i=0;i<_this.options.numYears;i++){
			_yearMark=$("<div class='horizontal-line-year' ></div>");
			_yearMark.css("margin-left",(i*_gap)+"%");
			_yearMark.css("width",_gap+"%");
			//Push no array das posicoes das barras verticais dos anos
			//passa objs tipo {pos:posicao da linha  ,  obj: objectos jquery com linha do ano} 
			_yearsPos.push({"pos":i*_gap,"obj":_yearMark});
			
			_this._timelineArea.append(_yearMark);
		}
		//desenha a ultima linha que termina a timeline
		_yearMark=$("<div class='horizontal-line-year'></div>");
		_yearMark.css("margin-left",99.55+"%");
		
		//Push no array das posicoes das barras verticais dos anos
		//passa objs tipo {pos:posicao da linha  ,  obj: objectos jquery com linha do ano} 
		_yearsPos.push({"pos":(_this._timelineArea.width()-3),"obj":_yearMark});
		
		_this._timelineArea.append(_yearMark);
		//retorna array com pos para colocar tags dos anos
		return _yearsPos;
	};
	
	myJqueryTimeline.prototype.drawYearsTags=function(){
		var _this=this;
		
		
		var _yearTag;
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
		
		for(i=0;i<_this.options.numYears;i++){
			_monthsEl=new Array();
			for(j=0;j<12;j++){
				j==0 ? _monthMark=$("<div class='horizontal-line-month first' style='border-style: none none none none;' id='"+months[j]+"'></div>") : _monthMark=$("<div class='horizontal-line-month' id='"+months[j]+"'></div>");
				_monthMark.css("left",(j*_gap)+"%");
				
				_monthsEl.push({"pos":(j*_gap)+"%","obj":_monthMark});
				_this._yearsEl[i].obj.append(_monthMark);
					
			}
			_this._yearsEl[i].months=_monthsEl;
		}
		return _this._yearsEl;
	};
	
	
	myJqueryTimeline.prototype.drawMonthsTags=function(){
		var _this=this;
		$(_this._yearsEl).each(function(ind,it){
			$(it.months).each(function(ind1,it1){
				
				if(_this.options.gapMonth<1){
					_monthTag=$("<div class='monthTag' style='left:-10px'>"+shortMonths[ind1]+"</div>");
					it1.obj.append(_monthTag);
				}else{
					_monthTag=$("<div class='monthTag'>"+months[ind1]+"</div>");
					
					it1.obj.append(_monthTag);
				}
				
				
			});
		});
		return _this._yearsEl;
		
	};
	
	myJqueryTimeline.prototype.drawEvents=function(){
		var _this=this;
		//console.log(_this);
		$(_this.options.events).each(function(ind,it){
			//if(it.start.getFullYear()>_this.options.startYear && it.end.getFullYear()<_this.options.startYear+_this.options.numYears){
			if(_this.checkDate(it.start,it.end)){
				var mult=0.4;
				var _posWidth=_this.getEventPositionWidth(it.start,it.end);
				var _eventBar={};
				_eventBar.start=_posWidth.start;
				_eventBar.end=_posWidth.end;
				_eventBar.obj=$("<div class='eventBar' evt='"+it.id+"'></div>").css("left",(_posWidth.start*_this.options.gapMonth)+"%");
				_eventBar.obj.css("width",(_posWidth.end*_this.options.gapMonth)+"%");
				_eventBar.obj.css("margin-left","2px");
				//console.log(_eventBar.css("left").split("%")[0]);
				//_eventBar.css("margin-left",_eventBar.css("margin-left").split("%")[0]+2+"px");
				_this.addEventListner(_eventBar.obj,"click");
				_this.addEventListner(_eventBar.obj,"mouseover");
				_this.addEventListner(_eventBar.obj,"mouseleave");
				
				_this._eventsEl.push(_eventBar);
				
				_this._timelineArea.append(_eventBar.obj);	
			}
				
					
					//if(it.end.next(it.start)){alert("depois")}
					//if(it.start.getMonth()<it.end.getMonth()){
							
				//	}
				
					
			
			
			
		});
		return _this._eventsEl;
	};
	
	
	
	
	myJqueryTimeline.prototype.getEventPositionWidth=function(start,end){
		var _this=this;
		var _ret={};
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
		if(sEvent == 'mouseover'){
			$retHtml.mouseover( 
				function(e){
					//get id elemente
					
					
					if($(e.target).hasClass("eventBar")  ){
						
						
						//console.log(_evts);
						
						var _tgt=_this.getEventEl($(e.target));
						
						var _evts=_this.getNearEvents(_tgt);
						console.log(_evts);
						
						$(_evts).each(function(ind,it){
							
						});
						var evento=_this.options.events[_tgt.obj.attr("evt")];
						var offset=_tgt.obj.offset();
						
						if(_tgt.obj.find(".tooltipTime").length==0){
							var _tooltipEl=$("<div class='tooltipTime' ></div>");
							_tooltipEl.append("<div class='tooltipTimeTitle' evt='"+evento.id+"'>"+evento.title+"</div>");
							_tooltipEl.append("<div class='tooltipTimeArrow' >&nbsp;</div>");
							_tooltipEl.css("left",e.pageX-offset.left-50); 
							_tgt.obj.append(_tooltipEl);
							_tooltipEl.fadeIn();
							
						}
						
					}
					//get event from array
					
					
				}
			);
		}
		if(sEvent == 'mouseleave'){
			$retHtml.mouseleave(function(e){
				if($(e.target).hasClass("eventBar")){
					
						var _tgt=_this.getEventEl($(e.target));
						_tgt.obj.find(".tooltipTime").fadeOut();
						setTimeout(function(){
							_tgt.obj.find(".tooltipTime").remove();		
						},300);
				}
			});
		}
		if(sEvent == 'click'){
		// Attach a click event handler to event objects
			$retHtml.click(function(e){
				var _tgt=_this.getEventEl($(e.target));
				//deselect actual
				
				if(_tgt.obj.hasClass("eventBar")){
					var _actTgt=_this.getEventElActive();
					if(_actTgt){
						_actTgt.obj.toggleClass("active");	
					}
					
					//console.log(_this._eventsEl.find(".active"));
					_tgt.obj.toggleClass("active");
					
				}	
				//console.log(_tgt);
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
		if(start.getFullYear()>_this.options.startYear && end.getFullYear()<_this.options.startYear+_this.options.numYears){
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
	
	$.fn.myJqueryTimeline = function(options) {
		return this.each(function() {
			var timeline = new myJqueryTimeline(this, options);
		});
	};	


	
}(jQuery, window));

	