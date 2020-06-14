$("document").ready(function () {

    $(".user-details").hide();
    
    $("#viewAllUsersBtn").on("click", function () {
        showAllUsers();
    });

    $("#viewAllTransactionsBtn").on("click", function () {
        showAllTransactions();
    });

    // $("#creditAmount").on("focus", function(){
    //     $(this).val()
    // });
    $("#transferBtn").on("click", function () {
        //Popup is now open
        $("#txnInvalid").hide();
        $("#txnNegative").hide();
        $("#transferModal").modal("show");
        $("#creditAmount").val(0);
        //Fill the transfer users
        var transferUsers = getTransferUsers();
        var options = "";
        for (var i = 0; i < transferUsers.length; i++) {
            options += '<option data-user-tag=' + transferUsers[i].id + '>' + transferUsers[i].name + '</option>';
        }
        $(".transfer-users").find("option").remove();
        $(".transfer-users").append(options);
    });

    $("#transferConfirmBtn").on("click",function(){
        transferAmount();
    });
});


var users = [];
var transactions  = [];
var currentUser = 0;

/**
 * fetch data from server and show it in UI (list)
 */
function showAllUsers() {
    getUsers().then(function(result){
         users=[];
         for(var i=0;i<result.length;i++){
            let user = {
                id: result[i].ID,
                name:result[i].Name,
                currentCredit: result[i].Credit_amount,
                email: result[i].Email,
                address: "",
                phone: result[i].phone
               }
             users.push(user);
        
         }
         renderUsers();
    })
}


function showAllTransactions() {
    getTransactions().then(function(result){
         transactions=[];
         for(var i=0;i<result.length;i++){
            let txn = {
                from: result[i].sender,
                to:result[i].receiver,
                amount: result[i].amount,
               }
             transactions.push(txn);
        
         }
         renderTransactions();
    })
}


function renderUsers(){
    $(".transactions-list").hide();
    $(".users-list").show();
    var listContainer = $(".users-list");
    hideContent();
    var listGroup = '<ul class="list-group"></ul>';
    listContainer.append(listGroup);
    var listGroup = $(".users-list").find(".list-group");
    for (var i = 0; i < users.length; i++) {
        var item = '<li data-user-tag=' + users[i].id + ' class="list-group-item d-flex justify-content-between align-items-center">' + users[i].name + '<span class="badge badge-primary badge-pill">' + users[i].currentCredit + '</span></li>';
        listGroup.append(item);
    }
    $(".list-group .list-group-item").on("click", function () {
        var userIndex = $(this).attr("data-user-tag");
        currentUser = userIndex;
        var user = users.find(u=>u.id==userIndex);
        var userDetailsContainer = $(".user-details");
        userDetailsContainer.find(".phone-num").text(user.phone);
        userDetailsContainer.find(".email-id").text(user.email);
        userDetailsContainer.find(".user-name").text(user.name);
        userDetailsContainer.find(".current-credit").text(user.currentCredit);
        hideContent();
        $(".user-details").show(400);
    });
}

function renderTransactions(){
    $(".users-list").hide();
    $(".transactions-list").show();
    var listContainer = $(".transactions-list ");
    hideContent();
    var listGroup = '<ul class="list-group"></ul>';
    listContainer.append(listGroup);
    var listGroup = $(".transactions-list").find(".list-group");
    for (var i = 0; i < transactions.length; i++) {
        var item = '<li class="list-group-item d-flex justify-content-between align-items-center">' + transactions[i].from  +' sent '+ transactions[i].amount +  ' to '+ transactions[i].to +'</li>';
        listGroup.append(item);
    }
}

function hideContent() {
    $(".list-container").find(".list-group").remove();
    $(".user-details").hide(400);
}

function getTransferUsers() {
    var transferUsers = [];
    var _users = users.slice();
    for (var i = 0; i < users.length; i++) {
        if (currentUser != users[i].id) {
            transferUsers.push(_users[i]);
        }
    }
    return transferUsers; 
}

function getUsers() {
    return $.ajax({
            url: "/users.php",
            method: "GET",
            success:function(result){
                console.log(result);
            },
            headers: {
                "Content-Type":"application/json"
            }
        })
}

function transferAmount(){
    var selectedIndex= document.getElementById("creditTo").selectedIndex;
    var creditTo=document.getElementById("creditTo").item(selectedIndex).getAttribute("data-user-tag");
    var amount = document.getElementById("creditAmount").value;
    amount= parseInt(amount,10);
    if(isNaN(amount)){
        amount = 0;
    }
    var _user = users.find(u=>u.id==currentUser);
    if(amount > _user.currentCredit){
        $("#txnInvalid").show();
        return;
    }
    else{
        $("#txnInvalid").hide();
    }

    if(amount < 0 ){
        $("#txnNegative").show();
        return;
    }
    else{
        $("#txnNegative").hide();
    }
    return $.ajax({
        url: "/transfer.php",
        method: "POST",
        data: JSON.stringify({
            from: currentUser,
            to: creditTo,
            amount: amount
        }),
        success:function(result){
            console.log(result);
            $("#transferModal").modal("hide");
            $(".current-credit").html(_user.currentCredit-amount);
            $("#txnSuccess").show().fadeOut(2000);
        },
        error:function(err){
            $("#transferModal").modal("hide");
            $("#txnFail").show().fadeOut(2000);
        },
        headers: {
            "Content-Type":"application/json"
        }
    })
}

function getTransactions() {
    return $.ajax({
            url: "/transactions.php",
            method: "GET",
            success:function(result){
                console.log(result);
            },
            headers: {
                "Content-Type":"application/json"
            }
        })
}


/**
 * UI
 * Database
 * app Server
 */