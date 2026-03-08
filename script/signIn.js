console.log("sign in functionality comming")

document.getElementById("signIn-btn").addEventListener("click",function(){
    // console.log("signIn button clicked")
    const userNameInput = document.getElementById("input-username");
    const userName = userNameInput.value;
    console.log(userName);

    const InputPassword = document.getElementById("input-password");
    const password = InputPassword.value;
    console.log(password);

    if(userName =="admin" && password =="admin123"){
        alert("sign in success");
        window.location.assign("/allPage.html");
    }else{
        alert("sign in failed");
        return;
    }
})