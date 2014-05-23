$( document ).ready(function() {

$('#register_button').click(function(){

name = $('#name').val();
email = $('#email').val();
password = $('#password').val();
confirm_password = $('#confirm_password').val();

if (name.length == 0 || email.length == 0 || password.length == 0 || confirm_password.length == 0)
	alert('Please make sure you filled out all values in the form');

else if ($.trim(password) != $.trim(confirm_password))
	alert('Please make sure you confirmed the right password');

else {


$.ajax({
  url: "/register",
  type: "POST",
  data: { full_name: name, email: email, password: password, confirm_password: confirm_password },
  dataType: "html"
}).done(function(data){

//string = ''



alert(data);


});

}



});



$('#login_button').click(function(){


email = $('#email').val();
password = $('#password').val();

if ( email.length == 0 || password.length == 0 )
	alert('Please make sure you filled out all values in the form');

else {


$.ajax({
  url: "/login",
  type: "POST",
  data: { email: email, password: password},
  dataType: "html"
}).done(function(data){

if (data == 'incorrect')
	alert("Incorrect username or password");
else if (data == 'unactivated')
	alert("User has not been activated");
else{
localStorage.setItem('email', email);
//alert(localStorage.getItem('email'));

alert(data);
window.location = "http://localhost:8000";
}

});

}



});






if (document.URL == 'http://localhost:8000/'){

if (activated){

$('#user_info').append('hello');

}


}









$('#copy').click(function(){

deposit_address = $('#deposit_address').html();
alert(deposit_address);

});


//connect to socket

  if (document.URL.indexOf('org') != -1)
      root = window.location.host;
  else 
      root = 'http://localhost:8000';


  var socket = io.connect(root);


  socket.on('fuck', function(fuck){
    //alert('wtf');
    //$('#bet_table').append(JSON.stringify(fuck));
  });

  socket.on('news', function(fuck){
    //alert('wtf');
    //$('#bet_table').append(JSON.stringify(fuck));
  });


  if (document.URL.indexOf('withdraw') != -1 && document.URL.indexOf('withdrawal') == -1){

    coin_info = data;
    code = coin_info.code;
    balance = coin_info.balance;
    code_upper = code.toUpperCase();
    withdraw_fee = coin_info.withdraw_fee;
    coin_name = coin_info.coin_name;


string = '<div class="tab_header">\
Withdraw ' + code_upper + 
'</div>\
<div class="tab_description"><div class="box"><span>\
<span id="deposit_address">Once submitted, all requests MUST be confirmed via email. \
Please only contact support if you have not received the confirmation email.</span></span>\
</div></div>\
<div id="withdraw_available_balance">\
Your current available ' + code_upper + ' balance: ' + balance + 
'</div>\
<div class="tab_header_modified" >\
Amount to Withdraw\
</div>\
<div id="error_message">\
</div>\
<input type="number" name="amount" id="withdraw_amount" value="0" required="required" class="error">\
</input> ' + code_upper + 
'<div class="tab_header_modified">\
Withdraw fee\
</div>\
<div class="tab_description">\
' + withdraw_fee + ' ' + code_upper + 
'</div>\
<div class="tab_header_modified">\
Net Withdraw amount\
</div>\
<div class="tab_description" id="net_withdraw_amount">\
0.000000 ' + code_upper + 
'</div>\
<div class="tab_header_modified" >\
' + code_upper + ' Withdrawal Address\
</div>\
<input type="text" id="withdrawal_address" style="width: 300px" required="required" class="error">\
</input>\
<div class="tab_header_modified" >\
Confirm Password\
</div>\
<input type="password" name="amount" id="withdraw_password" required="required" class="error">\
</input>\
<div class="tab_description">\
Please ensure all details are correct before submitting. Every request must be confirmed by email \
before it will be processed, most withdrawals are processed within 10 minutes of email confirmation. For \
security reasons, larger withdrawals can take longer as they may require manual verification. \
</div>\
<button type="button" class="btn btn-primary" id="withdraw_button" style="margin-top: 30px; margin-bottom: 100px">Withdraw</button>';
//alert(string);

//$('#below_tab_wrapper').empty();
$('#below_tab_wrapper').append(string);




//alert('here');
    $('#withdraw_amount').on('change', function () {
      withdraw_amount = $('#withdraw_amount').val();
      //alert('test');
      //alert($('#withdraw_amount').val());
      //alert($('#error_message').html());
      if (withdraw_amount > balance){
      if ($('#error_message').html().length < 3)
      $('#error_message').append('Withdraw amount must be equal to or less than your available balance.');
      }
      else if (withdraw_amount - withdraw_fee <=0){
      if ($('#error_message').html().length < 3)
      $('#error_message').append('Your net withdraw amount is less than or equal to 0. Please enter a greater amount.');
      if ($('#error_message').html().substr(0,3) == 'Wit'){
        $('#error_message').empty();
        $('#error_message').append('Your net withdraw amount is less than or equal to 0. Please enter a greater amount.');
      }


      }    
      else  {
      $('#error_message').empty();
      $('#net_withdraw_amount').html(withdraw_amount - 1)

      }
  });


    $('#withdraw_button').click(function(){
        amount = $('#withdraw_amount').val();
        address = $('#withdrawal_address').val();
        password = $('#withdraw_password').val();

        if ($('#error_message').html().length > 3)
        $("html, body").animate({ scrollTop: 0 }, "slow");

        else{

        email = localStorage.getItem('email');
        //alert(email);
        $.ajax({
          url: "/withdraw",
          type: "POST",
          data: {amount: amount, address: address, password: password, email: email, coin_name: coin_name},
          dataType: "html"
        }).done(function(data){
                    //alert(data);
          if (data == "withdraw"){


          string = '<div class="box_green"><span><span id="deposit_address">\
          <span style="font-weight: bold">Success!</span><br>\
          Your withdrawal request has now been added, please confirm by email and we will then process it.</span></span></div>\
          </div>';

          $('.box').before(string);        

          $("html, body").animate({ scrollTop: 0 }, "slow");


          }

          else
          alert(data);

        });


        }

        //alert('here');
    });



  
  }


  if (document.URL.indexOf('deposit') != -1){

    $('#deposits_li').attr('class', 'active');

    deposits = data;
    deposit_count = deposits.length;

//alert(deposits);

    string = '<div class="tab_header">\
Coin Deposits\
</div>\
<div class="tab_description">\
Below is a list of deposits that you have made. Click the expander icon on the left of each row to reveal more details \
about the deposit.<br><br>\
To make a new deposit, please visit the Balances page and select the Deposit option under the actions menu for \
the coin.\
<br><br>\
Displaying deposits 1 - ' + deposits.length + ' of ' + deposits.length +
'</div>\
<table class="table" id="tab_table">\
<tbody id="balance_tbody"><tr class="active">\
 <td></td>  <td class="active">TIME</td>\
   <td class="active">COIN</td>  <td class="active">AMOUNT</td>\
     <td class="active">DEPOSIT ADDRESS</td> <td class="active">STATUS</td></tr>';



$.each(deposits, function(key,val){
ticker_upper = val.coin_ticker.toUpperCase();
var status;
if (val.pending == false)
  status = 'CONFIRMED';
else
  status = 'PENDING';

    
    time = parseInt(val.time.toString().substring(0, val.time.toString().length - 3));
    
    array = moment.unix(time).toArray();
    var hi = moment.utc(array);
        //alert(hi);
    hi = hi.toString();
    index = hi.indexOf('GM');
    hi = hi.substr(0, index);
    deposit_time = hi;


substring = '<tr id="tab_row">\
 <td class="expander unclicked" id="' + val.txid + '"> </td><td class="tab_td">' + deposit_time + '</td>\
         <td class="tab_td">' + ticker_upper + '</td>        <td class="tab_td">' + val.amount + '</td>\
         <td class="tab_td">' + val.deposit_address + '</td> <td class="tab_td">' + status + '</td>\
</tr>';
string += substring;

});

string += '</tbody></table>'; 

$('#below_tab_wrapper').append(string);


$('.expander').click(function(){



class_name = $(this).attr('class');

if (class_name == 'expander unclicked'){
$(this).attr('class', 'expander clicked');
id = $(this).attr('id');
string = '<tr class="active">\
 <td colspan="6" class="left_td"><span class="inner_td">Transaction Id: ' + id + '</span></td>\
</tr>';

$(this).parent().after(string);
}
else{
$(this).attr('class', 'expander unclicked');
$(this).parent().next().remove();

//$(this).parent().after().remove();
}

});




  }





//withdrawals
/*
  if (document.URL.indexOf('withdraw') != -1 && document.URL.indexOf('withdrawal') == -1){

    coin_info = data;
    code = coin_info.code;
    balance = coin_info.balance;
    code_upper = code.toUpperCase();
    withdraw_fee = coin_info.withdraw_fee;
    coin_name = coin_info.coin_name;


string = '<div class="tab_header">\
Withdraw ' + code_upper + 
'</div>\
<div class="tab_description"><div class="box"><span>\
<span id="deposit_address">Once submitted, all requests MUST be confirmed via email. \
Please only contact support if you have not received the confirmation email.</span></span>\
</div></div>\
<div id="withdraw_available_balance">\
Your current available ' + code_upper + ' balance: ' + balance + 
'</div>\
<div class="tab_header_modified" >\
Amount to Withdraw\
</div>\
<div id="error_message">\
</div>\
<input type="number" name="amount" id="withdraw_amount" value="0" required="required" class="error">\
</input> ' + code_upper + 
'<div class="tab_header_modified">\
Withdraw fee\
</div>\
<div class="tab_description">\
' + withdraw_fee + ' ' + code_upper + 
'</div>\
<div class="tab_header_modified">\
Net Withdraw amount\
</div>\
<div class="tab_description" id="net_withdraw_amount">\
0.000000 ' + code_upper + 
'</div>\
<div class="tab_header_modified" >\
' + code_upper + ' Withdrawal Address\
</div>\
<input type="text" id="withdrawal_address" style="width: 300px" required="required" class="error">\
</input>\
<div class="tab_header_modified" >\
Confirm Password\
</div>\
<input type="password" name="amount" id="withdraw_password" required="required" class="error">\
</input>\
<div class="tab_description">\
Please ensure all details are correct before submitting. Every request must be confirmed by email \
before it will be processed, most withdrawals are processed within 10 minutes of email confirmation. For \
security reasons, larger withdrawals can take longer as they may require manual verification. \
</div>\
<button type="button" class="btn btn-primary" id="withdraw_button" style="margin-top: 30px; margin-bottom: 100px">Withdraw</button>';
//alert(string);

//$('#below_tab_wrapper').empty();
$('#below_tab_wrapper').append(string);




//alert('here');
    $('#withdraw_amount').on('change', function () {
      withdraw_amount = $('#withdraw_amount').val();
      //alert('test');
      //alert($('#withdraw_amount').val());
      //alert($('#error_message').html());
      if (withdraw_amount > balance){
      if ($('#error_message').html().length < 3)
      $('#error_message').append('Withdraw amount must be equal to or less than your available balance.');
      }
      else if (withdraw_amount - withdraw_fee <=0){
      if ($('#error_message').html().length < 3)
      $('#error_message').append('Your net withdraw amount is less than or equal to 0. Please enter a greater amount.');
      if ($('#error_message').html().substr(0,3) == 'Wit'){
        $('#error_message').empty();
        $('#error_message').append('Your net withdraw amount is less than or equal to 0. Please enter a greater amount.');
      }


      }    
      else  {
      $('#error_message').empty();
      $('#net_withdraw_amount').html(withdraw_amount - 1)

      }
  });


    $('#withdraw_button').click(function(){
        amount = $('#withdraw_amount').val();
        address = $('#withdrawal_address').val();
        password = $('#withdraw_password').val();

        if ($('#error_message').html().length > 3)
        $("html, body").animate({ scrollTop: 0 }, "slow");

        else{

        email = localStorage.getItem('email');
        //alert(email);
        $.ajax({
          url: "/withdraw",
          type: "POST",
          data: {amount: amount, address: address, password: password, email: email, coin_name: coin_name},
          dataType: "html"
        }).done(function(data){
                    //alert(data);
          if (data == "withdraw"){


          string = '<div class="box_green"><span><span id="deposit_address">\
          <span style="font-weight: bold">Success!</span><br>\
          Your withdrawal request has now been added, please confirm by email and we will then process it.</span></span></div>\
          </div>';

          $('.box').before(string);        

          $("html, body").animate({ scrollTop: 0 }, "slow");


          }

          else
          alert(data);

        });


        }

        //alert('here');
    });



  
  } */


  if (document.URL.indexOf('withdrawal') != -1){

    $('#withdrawals_li').attr('class', 'active');

    withdrawals = data;
    //alert(withdrawals);
    withdrawals_count = withdrawals.length;

//alert(deposits);


    string = '<div class="tab_header">\
Coin Withdrawals\
</div>\
<div class="tab_description">\
Below is a list of withdrawals that you have made. \
Click the expander icon on the left of each row to reveal more details about the withdrawal. <br><br>\
To make a new withdrawal, please visit the Balances page and select the Withdraw option under the actions menu for the coin. \
<br><br>\
Displaying deposits 1 - ' + withdrawals.length + ' of ' + withdrawals.length +
'</div>\
<table class="table" id="tab_table">\
<tbody id="balance_tbody"><tr class="active">\
 <td></td>  <td class="active">TIME</td>\
   <td class="active">COIN</td>  <td class="active">AMOUNT</td>\
     <td class="active">FEE</td>    <td class="active">RECEIVING ADDRESS </td> <td class="active">STATUS</td></tr>';

//alert(string);

$.each(withdrawals, function(key,val){


});

$.each(withdrawals, function(key,val){
if (val.coin_ticker != undefined)
ticker_upper = val.coin_ticker.toUpperCase();
else ticker_upper = 'DOGE';
var status;
if (val.pending == false)
  status = 'SUCCESSFUL';
else
  status = 'UNCONFIRMED';

    
    time = parseInt(val.time.toString().substring(0, val.time.toString().length - 3));
    
    array = moment.unix(time).toArray();
    var hi = moment.utc(array);
        //alert(hi);
    hi = hi.toString();
    index = hi.indexOf('GM');
    hi = hi.substr(0, index);
    withdrawal_time = hi;


if (val.txid == undefined)
  val.txid = 'Transaction is still unconfirmed. To confirm transaction, please check your email.';


substring = '<tr id="tab_row">\
 <td class="expander unclicked" id="' + val.txid + '"> </td><td class="tab_td">' + withdrawal_time + '</td>\
         <td class="tab_td">' + ticker_upper + '</td>        <td class="tab_td">' + val.amount + '</td>\
          <td class="tab_td">' + val.fee + '</td> <td class="tab_td">' + val.receiving_address + '</td> <td class="tab_td">' + status + '</td>\
</tr>';
string += substring;

});

string += '</tbody></table>'; 

$('#below_tab_wrapper').append(string);


$('.expander').click(function(){



class_name = $(this).attr('class');

if (class_name == 'expander unclicked'){
$(this).attr('class', 'expander clicked');
id = $(this).attr('id');
string = '<tr class="active">\
 <td colspan="7" class="left_td"><span class="inner_td">Transaction Id: ' + id + '</span></td>\
</tr>';

$(this).parent().after(string);
}
else{
$(this).attr('class', 'expander unclicked');
$(this).parent().next().remove();

//$(this).parent().after().remove();
}

});




  }




  if (document.URL.indexOf('orders') != -1){

    $('#orders_li').attr('class', 'active');

    orders = data;
    //alert(withdrawals);
    order_count = orders.length;

//alert(deposits);


    string = '<div class="tab_header">\
Open Orders\
</div>\
<div class="tab_description">\
Below is a list of orders that you have made. \
Any completed orders will show up under trade history. <br><br>\
Displaying orders 1 - ' + orders.length + ' of ' + orders.length +
'</div>\
<table class="table" id="tab_table">\
<tbody id="balance_tbody"><tr class="active"> <td span="1">ORDER ID</td>\
   <td span="1">TYPE</td>  <td span="1">MARKET</td>\
     <td span="1">TIME</td>    <td class="col-md-1">PRICE</td> <td class="col-md-1">AMOUNT</td>\
     <td class="col-md-1">TOTAL</td><td class="col-md-1">FEE</td><td class="col-md-1">NET TOTAL</td class="col-md-1"><td class="col-md-1"> </td></tr>';

//alert(string);


$.each(orders, function(key,val){

/*"time" : 1400544396647, "coin_one_ticker" : "doge", "coin_two_ticker" : "btc", "side" : "ask", "price" : 150, "quantity" : 1, "quantity_left" : 1, 
"user" : ObjectId("5377ff1015a0a90000000001"), "_id" : ObjectId("537a9c8cec45c0b264000001"), "pending" : "pending"
*/
if (val.type == 'ask')
  type = 'SELL';
else
  type = 'BUY';


    
    time = parseInt(val.time.toString().substring(0, val.time.toString().length - 3));
    
    array = moment.unix(time).toArray();
    var hi = moment.utc(array);
        //alert(hi);
    hi = hi.toString();
    index = hi.indexOf('GM');
    hi = hi.substr(0, index);
    order_time = hi;



substring = '<tr id="tab_row">\
        <td class="tab_td_order">' + val._id + '</td>\
        <td class="tab_td_order">' + type + '</td>\
        <td class="tab_td_order">' + val.coin_one_ticker.toUpperCase() + '/' + val.coin_two_ticker.toUpperCase() + '</td>\
        <td class="tab_td_order">' + order_time + '</td>\
        <td class="tab_td_order">' + val.price + '</td>\
        <td class="tab_td_order">' + val.quantity + '</td>\
        <td class="tab_td_order">' + val.quantity * val.price + '</td>\
        <td class="tab_td_order">' + '.015' + '</td>\
        <td class="tab_td_order">' + val.quantity * val.price * .015 + '</td>\
        <td class="tab_td_order">\
        <a class="cancel_order" href="#" order_id="' + val._id + '">\
        <img src="https://www.mintpal.com/assets/images/icons/delete.png"  alt="Cancel" class="2x" width="16"><br>  Cancel </a>\
        </td>\
</tr>';
string += substring;

});

string += '</tbody></table>'; 

$('#below_tab_wrapper').append(string);


$('.cancel_order').click(function(){

order_id = $(this).attr('order_id');
      $.ajax({
        url: "/cancel_order",
        type: "POST",
        data: {order_id: order_id},
        dataType: "html"
      }).done(function(data){

        alert(data);

      });

    });




  }







  if (document.URL.indexOf('market') != -1){


    coin_one_ticker_upper = coin_one_ticker.toUpperCase();
    coin_two_ticker_upper = coin_two_ticker.toUpperCase();

    coin_one_name_modified = coin_one_name.substr(0,1).toUpperCase() + coin_one_name.substr(1,coin_one_name.length);
    coin_two_name_modified = coin_two_name.substr(0,1).toUpperCase() + coin_two_name.substr(1,coin_two_name.length);

    coin_one_ticker_modified = coin_one_ticker.substr(0,1).toUpperCase() + coin_one_ticker.substr(1,coin_one_ticker.length);
    coin_two_ticker_modified = coin_two_ticker.substr(0,1).toUpperCase() + coin_two_ticker.substr(1,coin_two_ticker.length);

    last_price = last_price.toPrecision(9);
    low_price = low_price.toPrecision(9);
    high_price = high_price.toPrecision(9);
    volume = volume.toPrecision(9);

    coin_one_balance = coin_one_balance.toPrecision(9);
    coin_two_balance = coin_two_balance.toPrecision(9);

    min_order = 1;
    order_fee = .015;


    if (pending_asks.length == 0){
      pending_asks = new Array();
      obj = new Object();
      obj.price = 5;
      obj.quantity_left = 3;
      pending_asks.push(obj);
    }

    if (pending_bids.length == 0){
      pending_bids = new Array();
      obj = new Object();
      obj.price = 5;
      obj.quantity_left = 3;
      pending_bids.push(obj);
    }




    string = '<div id="top_header">\
    <div id="left_header">\
    <div id="trade_pair_header">' 
    + coin_one_ticker_upper + '/' + coin_two_ticker_upper +
    '</div>'
    + coin_one_name_modified + '/' + coin_two_name_modified + 
    '</div>\
    <div id="right_header">\
    <div class="stat">\
    <span class="title">LAST PRICE</span>\
    <br>\
    <strong>\
    <span id="span_last_price" class="">' + last_price + '</span>\
    </strong>\
    </div>\
    <div class="stat">\
    <span class="title">24 HR HIGH</span>\
    <br>\
    <strong>\
    <span id="span_24_high" class="">' + high_price + '</span>\
    </strong>\
    </div>\
    <div class="stat">\
    <span class="title">24 HR LOW</span>\
    <br>\
    <strong>\
    <span id="span_24_low" class="">' + low_price + '</span>\
    </strong>\
    </div>\
    <div class="stat unbordered">\
    <span class="title">24 HR VOLUME</span>\
    <br>\
    <strong>\
    <span id="span_24_low" class="">' + volume + ' ' + coin_two_ticker_upper + '</span>\
    </strong>\
    </div>\
    </div>\
    </div>\
    <div style="clear:right;"></div>\
    <div id="chartdiv" style="width:85%; height:600px; "></div>\
    <div id="buy_sell">\
    <div id="col1">\
    <h3>Buy ' + coin_one_ticker_modified + '</h3>\
    <div class="success box">Your ' + coin_two_ticker_upper + ' balance is <strong><a href="asdf" class="exchange_balance">' + coin_two_balance + '</a></strong>.</div>\
    <div class="box options">\
                <span class="label_style">Amount:</span> <input type="number" id="bid_quantity" name="amount" value="0.00000000" class="required"> ' + coin_one_ticker_upper + '<br>\
                <span class="label_style">Price Per DOGE:</span> <input type="number" id="bid_price" name="price" value="' + pending_asks[0].price.toPrecision(9) + '" class="required"> ' + coin_two_ticker_upper + '<br>\
                <span class="label_style">Total:</span> <span class="total" id="buy_total">' + pending_asks[0].price.toPrecision(9) + '</span> <br>\
                <span class="label_style">Trading Fee:</span> <span class="fee" id="buy_fee">0.00000000</span> BTC (' + (10 * order_fee).toPrecision(2) +  '%)<br>\
                <span class="label_style">Net Total:</span> <span class="netTotal" >' + pending_asks[0].price.toPrecision(9) + '</span> ' + coin_two_ticker_upper + 
                '           <input type="hidden" name="buyNetTotal" id="buy_net_total" value="' + pending_asks[0].price.toPrecision(9) + '" class="required">\
    </div>\
    <button type="button" class="btn btn-primary" id="buy_order">Submit Buy Order</button>\
    <h3>Sell Orders </h3>\
    <div class="scroll_table">\
    <table class="table" id="sell_table">\
    <tbody>\
    <tr>\
                  <th>PRICE (BTC)</th>\
                  <th>DOGE</th>\
                  <th>BTC</th>\
                </tr>';


    $.each(pending_asks, function(key,val){
    substring = '<tr price="0.00000103">\
    <td >' + val.price.toPrecision(9) + '</td>\
    <td >' + val.quantity_left.toPrecision(9) + '</td>\
    <td >' + (val.price * val.quantity_left).toPrecision(9) + '</td></tr>';
    string += substring;
    });


    string += '</tbody>\
    </table>\
    </div>\
    </div>\
    <div id="col2">\
    <h3>Sell ' + coin_two_ticker_modified + '</h3>\
    <div class="fail box">Your ' + coin_one_ticker_upper +' balance is <strong><a href="asdf" class="exchange_balance">' + coin_one_balance + '</a></strong>.</div>\
    <div class="box options">\
                <span class="label_style">Amount:</span> <input type="number" id="ask_quantity" name="amount" value="0.00000000" class="required"> ' + coin_one_ticker_upper + '<br>\
                <span class="label_style">Price Per DOGE:</span> <input type="number" id="ask_price" name="price" value="' + pending_bids[0].price.toPrecision(9) + '" class="required"> ' + coin_two_ticker_upper + '<br>\
                <span class="label_style">Total:</span> <span class="total" id="buy_total">' + pending_bids[0].price.toPrecision(9) + '</span> <br>\
                <span class="label_style">Trading Fee:</span> <span class="fee" id="buy_fee">0.00000000</span> BTC (' + (10 * order_fee).toPrecision(2) +  '%)<br>\
                <span class="label_style">Net Total:</span> <span class="netTotal" >' + pending_bids[0].price.toPrecision(9) + '</span> ' + coin_two_ticker_upper + 
                '           <input type="hidden" name="buyNetTotal" id="buy_net_total" value="' + pending_bids[0].price.toPrecision(9) + '" class="required">\
              </div>\
    <button type="button" class="btn btn-primary" id="ask_submit">Submit Sell Order</button>\
    <h3>Buy Orders </h3>\
    <div class="scroll_table">\
    <table class="table" id="sell_table">\
    <tbody>\
    <tr>\
                  <th>PRICE (' + coin_two_ticker_upper + ')</th>\
                  <th>' + coin_one_ticker_upper + '</th>\
                  <th>' + coin_two_ticker_upper + '</th>\
                </tr>';

    $.each(pending_bids, function(key,val){
    substring = '<tr price="0.00000103">\
    <td >' + val.price.toPrecision(9) + '</td>\
    <td >' + val.quantity_left.toPrecision(9) + '</td>\
    <td >' + (val.price * val.quantity_left).toPrecision(9) + '</td></tr>';
    string += substring;
    });


    string += '</tbody>\
    </table>\
    </div>\
    </div>\
    </div>';


//alert(string);

$('.inner_content').append(string);










    $('#buy_order').click(function(){
      bid_quantity = $('#bid_quantity').val();
      bid_price = $('#bid_price').val();
      coin_name_one = 'dogecoin';
      coin_name_two = 'bitcoin';
      coin_ticker_one = 'doge';
      coin_ticker_two = 'btc';
      //alert(buy_amount);

      //alert(coin_ticker_one);

      $.ajax({
        url: "/buy_order",
        type: "POST",
        data: {bid_quantity: bid_quantity, bid_price: bid_price, coin_ticker_one: coin_ticker_one, coin_ticker_two: coin_ticker_two, coin_name_one: coin_name_one, coin_name_two: coin_name_two , _csrf: csrf },
        dataType: "html"
      }).done(function(data){

        alert(data);

      });

    });




    $('#ask_submit').click(function(){
      ask_quantity = $('#ask_quantity').val();
      ask_price = $('#ask_price').val();
      coin_name_one = 'dogecoin';
      coin_name_two = 'bitcoin';
      coin_ticker_one = 'doge';
      coin_ticker_two = 'btc';


      $.ajax({
        url: "/ask",
        type: "POST",
        data: {ask_quantity: ask_quantity, ask_price: ask_price, coin_ticker_one: coin_ticker_one, coin_ticker_two: coin_ticker_two, coin_name_one: coin_name_one, coin_name_two: coin_name_two , _csrf: csrf },
        dataType: "html"
      }).done(function(data){

        alert(data);

      });

    });




    $('#sell_order').click(function(){
      sell_amount = $('#sell_amount').val();
      sell_price = $('#sell_price').val();
      coin_ticker_one = 'doge';
      coin_ticker_two = 'btc';
      //alert(buy_amount);


      $.ajax({
        url: "/sell_order",
        type: "POST",
        data: {sell_amount: sell_amount, sell_price: sell_price, coin_ticker_one: coin_ticker_one, coin_ticker_two: coin_ticker_two, _csrf: csrf },
        dataType: "html"
      }).done(function(data){

        alert(data);

      });

    });




  }


  if (document.URL.indexOf('balances') != -1){
    
    $('#balances_li').attr('class', 'active');
    //alert('test');
    array = new Array();
    array.push(data.bitcoin);
    array.push(data.dogecoin);
    //alert(JSON.stringify(populated));
    array.sort(function(a,b){return a.coin_number - b.coin_number});
    //alert(JSON.stringify(array));


    string = '<div class="tab_header">\
Account Balances\
</div>\
<div class="tab_description">\
Use the actions button to deposit, withdraw or view orders/trades for that specific coin.\
</div>\
<table class="table" id="tab_table">\
  <tbody id="balance_tbody">\
  <tr class="active">\
  <td class="active">COIN NAME</td>\
  <td class="active">CODE</td>\
  <td class="active">AVAILABLE<br>BALANCE</td>\
  <td class="active">PENDING<br>DEPOSITS</td>\
  <td class="active">PENDING<br>WITHDRAWALS</td>\
  <td class="active">HELD FOR<br>ORDERS</td>\
  <td class="active"></td>\
  </tr>';



    $.each(array, function(key,val){

      //alert(val.code)

      substring = '<tr id="tab_row">\
        <td class="tab_td">' + val.coin_name +'</td>\
        <td class="tab_td">' + val.code +'</td>\
        <td class="tab_td">' + val.balance + '</td>\
        <td class="tab_td">' + val.pending_deposits + ' </td>\
        <td class="tab_td">' + val.pending_withdrawals + ' </td>\
        <td class="tab_td">' + val.held_for_orders + ' </td>\
        <td class="tab_td">\
          <ul class="nav navbar-nav navbar-right">\
          <li class="dropdown">\
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">Actions <b class="caret"></b></a>\
           <ul class="dropdown-menu">\
            <li><a class="deposit_dropdown" id="deposit_' + val.coin_name + '">Deposit</a></li>\
            <li><a  class="withdraw_dropdown" id="withdraw_' + val.code + '">Withdraw</a></li>\
            <li><a href="#">View Deposits</a></li>\
            <li><a href="#">View Withdrawals</a></li>\
            <li><a href="#">View Orders</a></li>\
            <li><a href="#">View Trades</a></li>\
          </ul>\
        </li>\
        </ul>\
  </td>\
  </tr>';

  //alert(substring);

      string += substring;
    });



string +='</tbody></table>';

//alert(string);

//$('#below_tab_wrapper').empty();
$('#below_tab_wrapper').append(string);



$('.deposit_dropdown').click(function(){
//alert('test');

var id = $(this).attr('id');
id = id.substr(8, id.length);
//alert(id);

string = '  <tr id=\"tab_row\">\r\n  <td class=\"tab_td\">dogecoin<\/td>\r\n  <td class=\"tab_td\">doge<\/td>\r\n  <td class=\"tab_td\">0.00000000<\/td>\r\n  <td class=\"tab_td\">0.00000000<\/td>\r\n  <td class=\"tab_td\">0.00000000<\/td>\r\n  <td class=\"tab_td\">0.00000000<\/td>\r\n  <td class=\"tab_td\">\r\n\r\n\r\n          <ul class=\"nav navbar-nav navbar-right\">\r\n          <li class=\"dropdown\">\r\n          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">Actions <b class=\"caret\"><\/b><\/a>\r\n\r\n      \r\n          <ul class=\"dropdown-menu\">\r\n            <li><a href=\"#asdf\" id=\"deposit_dropdown\">Deposit<\/a><\/li>\r\n            <li><a href=\"\">Withdraw<\/a><\/li>\r\n            <li><a href=\"#\">View Deposits<\/a><\/li>\r\n            <li><a href=\"#\">View Withdrawals<\/a><\/li>\r\n            <li><a href=\"#\">View Orders<\/a><\/li>\r\n            <li><a href=\"#\">View Trades<\/a><\/li>\r\n          <\/ul>\r\n        <\/li>  \r\n        <\/ul>\r\n\r\n  <\/td>\r\n\r\n  <\/tr>\r\n';
//$('#balance_tbody').append(string);

$.ajax({
  url: "/get_address",
  type: "POST",
  data: {coin_name: id},
  dataType: "html"
}).done(function(data){

data = JSON.parse(data);

string = '<div class="tab_header">\
Deposit ' + data.code + 
'</div>\
<div class="tab_description">\
Your current available ' + data.code + ' balance: <span id="deposited_amount">' + data.balance + '</span>\
</div>\
<div class="tab_header">\
Your Deposit Address\
</div>\
<div class="tab_description">\
<div class="box"> <span> <span id="deposit_address">' + data.deposit_address + 
'</span></span></div>\
</div>\
<div class="bottom_tab_description">\
You may also use previously generated deposit addresses. <br><br>\
Deposits are confirmed and will be available to use after \
<span style="font-weight: bold">' + data.confirmation + '</span> confirmations. Once our system has picked up\
 the transaction it will show in the deposits listing as pending, this may take a few \
minutes from when the transaction has been broadcast to the network.\
</div>';

$('#below_tab_wrapper').empty();
$('#below_tab_wrapper').append(string);



});



});



$('.withdraw_dropdown').click(function(){



var id = $(this).attr('id');
id = id.substr(9, id.length);
test = 'http://localhost:8000/withdraw/' + id;
window.location = test;
});


  }







});