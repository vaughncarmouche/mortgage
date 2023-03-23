var config = {
	type: 'doughnut',
	data: {
		labels: [
			'Principal & interest',
			'Property taxes',
			'Home insurance',
			'HOA',
			'Mortgage Insurance',
			'Other Payment',
		],
		datasets: [{
			data: [21,23,23],
			backgroundColor: [
				'#059BFF',
				'#22CECE',
				'#FF9124',
				'#FF3D67',
				'#FFC233',
				'#10c78d',
			],
			
			label: 'Dataset 1'
		}],
		
		
	},
	options: {
		events: [''],
		responsive: true,
		cutoutPercentage:65,
		legend: {
			display: false,
			fullWidth: true,
			position: 'bottom',
			labels:{
				usePointStyle: true,
				padding: 10,

			}
		},
		title: {
			display: true,
			text: ''
		},
		animation: {
			animateScale: true,
			animateRotate: true
		}
	}
};
	var ctx = document.getElementById('myChart').getContext('2d');
	doughnut = new Chart(ctx, config);
	document.getElementById('chartjsLegend').innerHTML = doughnut.generateLegend();


jQuery(document).ready(function($){
   
    var $range = $(".sk-sld");
    var $input = $(".sk-inp");
    $range.ionRangeSlider({
        type: "single",
        hide_min_max: true,
        keyboard: true,
        step: 1,
        hide_from_to: true,
        grid: true,
		min: 0,
		onStart: function (data) {
		},
		onChange: function (data) {
			var sliderId = data.slider.prevObject[0].id;
			if(sliderId == 'price-sld'){
				$downInstance = $("#dPayment-sld").data("ionRangeSlider");
				$('#dPayment').val(addCommas((inputVal('#price')*inputVal('#downPayPercent')/100).toFixed(0)));
				
			}
			if(sliderId == 'dPayment-sld'){
				$('#dPayment').val(addCommas((inputVal('#price')*inputVal('#downPayPercent')/100).toFixed(0)));
				
			}
		}
    });
    $($range).bind("input", function () {
        var $this = $(this);
        value = $this.prop("value");
		$inputClass = $this.attr("data-inp");
		
		$('.'+$inputClass).prop("value", addCommas(this.value));
		var priceVal = inputVal('#price');
		$('#taxPercent').val( roundToX((inputVal('#tax') * 100) /  priceVal,2));
		$('#insurPercent').val( roundToX((inputVal('#insur') * 100) /  priceVal,2));
		$('#hoaPercent').val( roundToX((inputVal('#hoa') * 100) /  priceVal,2));
		$('#mortgageInsuPercent').val( roundToX((inputVal('#mortgageInsu') * 100) /  priceVal,2));
		$('#otherPayPercent').val( roundToX((inputVal('#otherPay') * 100) /  priceVal,2));
	});
    $input.on("input", function () {
		var $this = $(this);
        $sliderClass = $this.attr("data-sld");
        var instance = $('.'+$sliderClass).data("ionRangeSlider");
		var val = $this.prop("value");
		val = Number(val.replace(/,/g, ''));
		var id = $(this).attr('id');
		var sMx = +$('.'+$sliderClass).attr('data-max');
		if(id == 'price' || id == 'tax' || id == 'insur' || id == 'hoa' || id == 'mortgageInsu' || id == 'otherPay'){
			if(id == 'price'){
				$('#dPayment').val(addCommas(roundToX(inputVal('#price')*inputVal('#downPayPercent')/100,2)));
				
			}
			if(val > sMx){
				instance.update({
					from: val,
					max: val
				});
			}else{
				instance.update({
					from: val,
					max: sMx
				});
			}
		}else if(id == 'downPayPercent'){
			$('#dPayment').val((inputVal('#price')*inputVal('#downPayPercent')/100).toFixed(0));
		}
		else if(id == 'interest'){
			instance.update({
				from: val
			});
		}
		else if(id == 'loanType'){
			instance.update({
				from: val
			});
		}

        
	});
	$($input).trigger('input');
	function roundToX(num, X) {    
		return +(Math.round(num + "e+"+X)  + "e-"+X);
	}
	function inputVal(selector){
		return +$(selector).val().replace(/,/g, '');
		
	}
	
	$('#dPayment,#taxPercent,#insurPercent,#hoaPercent,#mortgageInsuPercent,#otherPayPercent').on('input',function(){
		var id = this.id;
		if(id=='dPayment'){
			this.value = addCommas(this.value.replace(/,/,''));
			var val = (inputVal('#dPayment') * 100 ) / inputVal('#price');
			$('#downPayPercent').val(roundToX(val,2));
			var slider = '.downP-sld';
		}else 
		if(id=='taxPercent'){
			var val = inputVal('#price') * this.value / 100;
			var slider = '.tax-sld';
			$('#tax').val(roundToX(val,2));
		}else 
		if(id=='insurPercent'){
			var val = inputVal('#price') * this.value / 100;
			var slider = '.homeIns-sld';
			$('#insur').val(roundToX(val,2))
		}else 
		if(id=='hoaPercent'){
			var val = inputVal('#price') * this.value / 100;
			var slider = '.hoa-sld';
			$('#hoa').val(roundToX(val,2))
		}
		else 
		if(id=='mortgageInsuPercent'){
			var val = inputVal('#price') * this.value / 100;
			var slider = '.mortInsu-sld';
			$('#mortgageInsu').val(roundToX(val,2));
		}else 
		if(id=='otherPayPercent'){
			var val = inputVal('#price') * this.value / 100;
			var slider = '.otherPay-sld';
			$('#otherPay').val(roundToX(val,2));
		}

		var instance = $(slider).data("ionRangeSlider");
		instance.update({
			from: val
		});
	});
    $('.input').bind('input',function(){
        var price = inputVal('#price');
        var dPayment = inputVal('#dPayment');
        var interest = inputVal('#interest');
        var loanType = inputVal('#loanType') * 12;
        var tax = inputVal('#tax') / 12;
        var insur = inputVal('#insur') / 12;
        var hoa = inputVal('#hoa');
		var mortgageInsu = inputVal('#mortgageInsu');
		var otherPay = inputVal('#otherPay');
		
		var principle = price - dPayment;
		var error = false;
		var id = $(this).attr('id');
		if( id == 'downPayPercent'){
			var percent = $('#downPayPercent').val();
			percent = percent > 100 ? 100 : percent;
			var price = inputVal('#price');
			var val = (price * percent / 100).toFixed(0);
			$('#downPayPercent').val(percent);
			$('#dPayment').val(addCommas(val));
		}
			if(interest > 100){
				interest = 100;
				$('#interest').val(interest);
				$intInstance = $("#int-sld").data("ionRangeSlider");
				$intInstance.update({
					from: interest
				}); 
			}
			if(dPayment > price){
				dPayment = price;
				$('#dPayment').val(dPayment);
			}
			

			var pmt = computeMonthlyPayment(principle,loanType,interest);
			var monthPay = pmt + tax + insur + hoa + mortgageInsu + otherPay;
			var tltPay = pmt * loanType;
			var tltInt = tltPay - principle;
			
			var data = [pmt,tax,insur,hoa,mortgageInsu,otherPay];
			var labels = [
				'Principal & interest <samp class="lValue">$'+addCommas(pmt.toFixed(2))+'</samp>',
				'Property taxes<samp class="lValue">$'+addCommas(tax.toFixed(2))+'</samp>',
				'Home insurance<samp class="lValue">$'+addCommas(insur.toFixed(2))+'</samp>',
				'HOA<samp class="lValue">$'+addCommas(hoa.toFixed(2))+'</samp>',
				'Mortgage Insurance<samp class="lValue">$'+addCommas(mortgageInsu.toFixed(2))+'</samp>',
				'Other Payment<samp class="lValue">$'+addCommas(otherPay.toFixed(2))+'</samp>',
			];
			addData(doughnut, labels, data);
			$('#monPay, #monthly-amount-text').text('$'+addCommas((monthPay).toFixed(0)));
			$('#tlt-pay-monthly').text('$'+addCommas(Math.round(monthPay)));
			$('#tlt-pay').text('$'+addCommas(Math.round(tltPay)));
			$('#tlt-int').text('$'+addCommas(Math.round(tltInt)));
			$('#prin-int').text('$'+addCommas(Math.round(pmt)));
			$('#prop-tex').text('$'+addCommas(Math.round(tax)));
			$('#home-ins').text('$'+addCommas(Math.round(insur)));
			$('#hoa-res').text('$'+addCommas(Math.round(hoa)));
			document.getElementById('chartjsLegend').innerHTML = doughnut.generateLegend();
			createReport(principle,interest,loanType,pmt);
	});
	$('.sk-inp').trigger('input');
	$('#showSchedule').click(function() {
		if ($(this).is(':checked')) {
		 $('.payment-schedult').removeClass('hide');
		}else{
			$('.payment-schedult').addClass('hide');
		}
	});
	$('input').on('focus', function(){
		var sp = $(this).prev('.addOn');
		$(sp).css({'borderColor':'#1342f4'});
	});
	$('input').on('blur', function(){
		var sp = $(this).prev('.addOn');
		$(sp).css({'borderColor':'#cdd1d4'});
	})
});           

        function computeMonthlyPayment(prin, numPmts, intRate) {

            var pmtAmt = 0;
            
            if(intRate == 0) {
                pmtAmt = prin / numPmts;
            } else {
                    intRate = intRate / 100.0 / 12;
            
                var pow = 1;
                for (var j = 0; j < numPmts; j++){
                    pow = pow * (1 + intRate);
                }
            
                pmtAmt = (prin * pow * intRate) / (pow - 1);
            
            }
            
            return pmtAmt;
            
		}
		function addData(chart, label, data) {
			chart.data.labels = label;
			chart.data.datasets.forEach((dataset) => {
				dataset.data = data;
			});
			chart.update();
		}
		function addCommas(nStr) {
			nStr += '';
			x = nStr.split('.');
			x1 = x[0];
			x2 = x.length > 1 ? '.' + x[1] : '';
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
					x1 = x1.replace(rgx, '$1' + ',' + '$2');
			}
			return x1 + x2;
		}
		function fns(num, places, comma, type, show) {
    
			var sym_1 = "$";
			var sym_2 = ""; 
		
			var isNeg=0;
		
			if(num < 0) {
				num=num*-1;
				isNeg=1;
			}
		
			var myDecFact = 1;
			var myPlaces = 0;
			var myZeros = "";
			while(myPlaces < places) {
				myDecFact = myDecFact * 10;
				myPlaces = Number(myPlaces) + Number(1);
				myZeros = myZeros + "0";
			}
			
			onum=Math.round(num*myDecFact)/myDecFact;
				
			integer=Math.floor(onum);
		
			if (Math.ceil(onum) == integer) {
				decimal=myZeros;
			} else{
				decimal=Math.round((onum-integer)* myDecFact);
			}
			decimal=decimal.toString();
			if (decimal.length<places) {
				fillZeroes = places - decimal.length;
				for (z=0;z<fillZeroes;z++) {
				decimal="0"+decimal;
				}
				}
		
			if(places > 0) {
				decimal = "." + decimal;
			}
		
			if(comma == 1) {
			integer=integer.toString();
			var tmpnum="";
			var tmpinteger="";
			var y=0;
		
			for (x=integer.length;x>0;x--) {
				tmpnum=tmpnum+integer.charAt(x-1);
				y=y+1;
				if (y==3 & x>1) {
					tmpnum=tmpnum+",";
					y=0;
				}
			}
		
			for (x=tmpnum.length;x>0;x--) {
				tmpinteger=tmpinteger+tmpnum.charAt(x-1);
			}
		
		
			finNum=tmpinteger+""+decimal;
			} else {
				finNum=integer+""+decimal;
			}
		
			if(isNeg == 1) {
				if(type == 1 && show == 1) {
					finNum = "-" + sym_1 + "" + finNum + "" + sym_2;
				} else {
					finNum = "-" + finNum;
				}
			} else {
				if(show == 1) {
					if(type == 1) {
						finNum = sym_1 + "" + finNum + "" + sym_2;
					} 
                    else{
                        if(type == 2) {
                            finNum = finNum + "%";
                        }
                    }
		
				}
		
			}
		
			return finNum;
		}
		function createReport(v_principal,v_rate,v_term,pmt) {
			document.getElementById('amort_sched').innerHTML = '';
		
		
				var v_pmt_months = v_term;
		
				var v_pi_pmt = pmt;
		
				var v_prin = v_principal;
				var v_int = v_rate;
				if(v_int >= 1) {
					v_int /= 100;
				}
				v_int /= 12;
		
				var npr = v_pmt_months;
		
				var v_int_port = 0;
				var v_accum_int = 0;
				var v_prin_port = 0;
				var v_accum_prin = 0;
				var v_count = 0;
				var v_pmt_row = "";
				var v_pmt_num = 0;
		
				var v_display_pmt_amt = 0;
		
				var v_accum_year_prin = 0;
				var v_accum_year_int = 0;
		
				while(v_count < npr) {
		
					if(v_count < (npr - 1)) {
		
					v_int_port = Math.round(v_prin * v_int * 100) / 100;
					v_accum_int = Number(v_accum_int) + Number(v_int_port);
					v_accum_year_int = Number(v_accum_year_int) + Number(v_int_port);
		
					v_prin_port = Number(v_pi_pmt) - Number(v_int_port);
					v_accum_prin = Number(v_accum_prin) + Number(v_prin_port);
					v_accum_year_prin = Number(v_accum_year_prin) + Number(v_prin_port);
		
					v_prin = Number(v_prin) - Number(v_prin_port);
		
					v_display_pmt_amt = Number(v_prin_port) + Number(v_int_port);
		
					} else {
		
					v_int_port = Math.round(v_prin * v_int * 100) / 100;
					v_accum_int = Number(v_accum_int) + Number(v_int_port);
					v_accum_year_int = Number(v_accum_year_int) + Number(v_int_port);
		
					v_accum_int = Number(v_accum_int) + Number(v_int_port);
					v_accum_year_int = Number(v_accum_year_int) + Number(v_int_port);
		
					v_prin_port = v_prin;
		
					v_accum_prin = Number(v_accum_prin) + Number(v_prin_port);
					v_accum_year_prin = Number(v_accum_year_prin) + Number(v_prin_port);
		
					v_prin = 0;
					v_display_pmt_amt = Number(v_prin_port) + Number(v_int_port);
					}
		
					v_count = Number(v_count) + Number(1);
		
					v_pmt_num = Number(v_pmt_num) + Number(1);
		
					var tbody = document.getElementById('amort_sched');
		
					var row = document.createElement('tr');
					var cell1 = document.createElement('td');
					cell1.innerHTML = '' + v_count + '';
					row.appendChild(cell1);
					var cell2 = document.createElement('td');
					cell2.innerHTML = '' + fns(v_display_pmt_amt,2,1,1,1) + '';
					row.appendChild(cell2);
					var cell3 = document.createElement('td');
					cell3.innerHTML = '' + fns(v_prin_port,2,1,1,1) + '' ;
					row.appendChild(cell3);
					var cell4 = document.createElement('td');
					cell4.innerHTML = '' + fns(v_int_port,2,1,1,1) + '';
					row.appendChild(cell4);
					var cell5 = document.createElement('td');
					cell5.innerHTML = '' + fns(v_prin,2,1,1,1) + '';
					row.appendChild(cell5);
					tbody.appendChild(row);
		
				}
		}