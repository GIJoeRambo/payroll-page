$(function(){
	
	/*变量*/	
	{
		var $formInput = $('.py_pricing_block_2_input_area'); //input area
		var $checkpriceBtn = $('.py_pricing_block_2_input_btn'); //check price btn
		var $otherPrice = $('.py_pricing_block_2_calculate_right_number') //other price
		var $ourPrice = $('.py_pricing_block_2_calculate_left_number'); //our price
		var $rangeBar = $('#py_pricing_block_2_rangebar');
		var $month = $('.py_pricing_block_2_calculate_mth');
		var $pop = $('#pop');

		var ourPriceFlyToLeftTime = 1000;
		var otherPrice = undefined;
		var delayFlag = false;
		var intervalFlag = false;
		var ourFontSize = parseInt($ourPrice.css('fontSize'));
	}


	/*键盘输入控制 number only*/
	{
		$formInput.keypress(function(){
			if(event.keyCode < 48 || event.keyCode > 57) event.returnValue = false;    
		})

		$formInput.keyup(function(){
			this.value=this.value.replace(/\D/g,'');
		})
	}

	/*初始化*/
	{
		$formInput.val(0);
	}

	/*Check Price按钮点击事件*/
	{
		$checkpriceBtn.eq(0).click(function(){	
			initialize();
			//大于50按50计算
			let	numOfEmployee = Number($formInput.val());
			numOfEmployee = biggerThan50(numOfEmployee);
			mainExe(numOfEmployee);
			$rangeBar.val(numOfEmployee);
			pop();
			
		})
	}

	/*rangebar change事件*/
	{
		$rangeBar.change(function(){
			initialize();
			let numOfEmployee = $rangeBar.val();
			$formInput.val(numOfEmployee);
			mainExe(numOfEmployee);
			pop();
		})
	}

	/*rangebar 移动事件*/
	{
		$rangeBar.on('input',function(){
			$formInput.val($rangeBar.val());
			pop();	
		})
	}


	/*Functions*/
	{
		function initialize(){
			$ourPrice.stop(true,true);
			if(delayFlag === true){
				clearTimeout(discountDelay);	
				clearTimeout(shellDelay);
				clearTimeout(flyDelay);	
				delayFlag = false;
			}	
			if(intervalFlag === true){
				clearInterval(discountt);
				intervalFlag = false;
			}
			$ourPrice.stop(true,true);
			$ourPrice.css({fontSize:ourFontSize});	
			otherPrice = undefined;

			$month.css({visibility:'hidden'});
			$ourPrice.css({visibility:'hidden'});
			$otherPrice.css({visibility:'hidden'});
		
		
		}
		function biggerThan50(numOfEmployee){
			if(numOfEmployee > 50){
				numOfEmployee = 50;
			}
			$formInput.val(numOfEmployee);
			return numOfEmployee;
		}
		function Location(obj){		
			this.top =obj.offset().top;
			this.left =obj.offset().left;
		}	
		function discount(numm){		
		
			discountt = setInterval(function(){	
				discountNum(numm);
				numm-= 1;

			},10);	
			intervalFlag = true;
		}
		function discountNum(nummm){	
		
			if(nummm < 1){	
				clearInterval(discountt);
				//our Payroll 放大	
				$ourPrice.animate({fontSize: ourFontSize*2.5}).animate({fontSize: ourFontSize*0.75}).animate({fontSize: ourFontSize});
				// console.log(ourFontSize);		
			}

			else{
				
				nummm-=1;	
				$ourPrice.html('$'+nummm);
			}	
		}
		function pop(){
			
			$pop.html($rangeBar.val());
			let popOffset = -1.15 + 2.3/50 * $rangeBar.val() + 'rem';
			$pop.css({left:popOffset})
		}
		function mainExe(numOfEmployee){	
			let calculating = new Calculating(numOfEmployee);
			otherPrice = calculating.feesCalculating();

			//获得other 坐标
			let locationOther = new Location($otherPrice);
			let otherTop = locationOther.top;
			let otherLeft = locationOther.left;

			//获得our 坐标
			let locationOur = new Location($ourPrice);
			let ourTop = locationOur.top;
			let ourLeft = locationOur.left;

			//座标差
			let Xoffset = otherLeft - ourLeft;
			// console.log(ourTop);
			// console.log(ourLeft);

			$('.yp_pricing_shell').show();
			$('.yp_pricing_logo_gif').show();

			$("html,body").animate({scrollTop:$('#anchor').offset().top},1000);
			
			shellDelay = setTimeout(function(){
				delayFlag = true;
				$('.yp_pricing_shell').hide();
				$('.yp_pricing_logo_gif').hide();

				$month.css({visibility:'visible'});
				$otherPrice.html('$'+otherPrice).css({visibility:'visible'});	

				flyDelay = setTimeout(function(){
					delayFlag = true;
					/*our Payroll 展示*/
					//our Payroll 飞到左侧
					$ourPrice.html('$'+otherPrice).css({visibility:'visible',position:'relative',left:Xoffset,zIndex:'100',color:'red'});
					$ourPrice.animate({left: 0},ourPriceFlyToLeftTime);	
				},1000)
			},1500)

	
			//our Payroll 倒数	
			let num = otherPrice;	
			discountDelay = setTimeout(discount,ourPriceFlyToLeftTime + 1500 + 1000,num);		
			
			delayFlag = true;
				
		}
		
		//Other Payroll money calculating
		function Calculating(numOfEmployee){	
			this.numOfEmployee = numOfEmployee? numOfEmployee:0;
			this.monthlyBaseFees = 7.75 * 52 / 12;
			this.gstAdded = 1.15;

			this.feesCalculating = function(){
				let fees_per_person = (this.numberOfEmployee > 5) ? 2 : 1.5;
				if(this.numOfEmployee <=0){
					return 0;
				}
				else{
					return ( Math.ceil(this.monthlyBaseFees * this.gstAdded + fees_per_person * this.numOfEmployee * 52 / 12 * this.gstAdded) );
				}
			}
		}

	}

});