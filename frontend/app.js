var userList = [],html,newHtml;

var checkUserAccess = function(){
  let token = localStorage.getItem("token");
  let test = {
    token: JSON.parse(token)
  }

  fetch('http://localhost:3005/verify-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(test)
    })
  .then(data => {
    console.log("RESPONSE",data);
    if(data.status == 200) {
      document.getElementById('login').style.display = "none";
      document.getElementById('table').style.display = "block"; 
    }
    else {
      document.getElementById('login').style.display = "block";
      document.getElementById('table').style.display = "none"; 
    }
    })
    .catch((error) => {
      console.log('Error:', error);
    });
  } 

checkUserAccess();

var loginEmployee = function(){  
  event.preventDefault();
  var email=document.myform.email.value;  
  var password=document.myform.password.value;  

  if (email==null || email==""){  
    alert("Enter Valid Email");  
    return false;  
  }else if(password.length<6 || password==null){  
    alert("Enter Valid Password.");  
    return false;  
  }  
    let userDetails = {
      email: email,
      password: password
    }
    fetch('http://localhost:3005/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(userDetails)
    })
    .then(response => response.json())
    .then(data => {
       if(Object.keys(data).length == 0) {
         console.log("Error");
         checkUserAccess();
       }
       else {
         localStorage.setItem("token",JSON.stringify(data))
         checkUserAccess();
         getAllEmployeeList();
       }
    })
    .catch((error) => {
      console.log('Error:', error);
    });
  } 
var cleanUpEmpList = function() {
    document
    .querySelector('#tbody').innerHTML = '';
}

var cleanUpEmpAddForm = function() {
    document.addform.name.value = '';
    document.addform.email.value = '';
    document.addform.password.value ='';
    document.addform.empcode.value = '';
    document.addform.phone.value = '';
}
  
var renderUserList = function(userList) {
    cleanUpEmpList();

    for(let i = 0; i < userList.length;i++) {
    html = `<tr>
    <td>%name%</td>
    <td>%email%</td>
    <td>%password%</td>
    <td>%empcode%</d>
    <td>%phoneNumber%</td>
    <td>
        <a href="#editEmployeeModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" onClick="getEmployee(${i})"  title="Edit">&#xE254;</i></a>
        <a href="#deleteEmployeeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" onClick="deleteEmployee(${i})" title="Delete">&#xE872;</i></a>
    </td>
    </tr>`;

    newHtml = html.replace('%name%', userList[i].name ?  userList[i].name : '--' );
    newHtml = newHtml.replace('%email%',userList[i].email);
    newHtml = newHtml.replace('%password%' ,userList[i].password)
    newHtml = newHtml.replace('%phoneNumber%', userList[i].phone ? userList[i].phone : '--' );
    newHtml = newHtml.replace('%empcode%',userList[i].empcode ? userList[i].empcode : '--')
    document
      .querySelector('#tbody')
      .insertAdjacentHTML('beforeend', newHtml);
    }
    
}


var deleteEmployee = function(index) {
  lastIndex = index;
  let deleteUsers = userList[index];
  fetch(`http://localhost:3005/${deleteUsers._id}`,{
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })
  .then(response => response.json())
  .then(data => {
    getAllEmployeeList();
    console.log('Success:', data);
  })
  .catch((error) => {
    console.log('Error:', error);
  })
}
var lastIndex;
var getEmployee = function(index) {
  lastIndex = index;
  let userDetails = userList[index];
  fetch(`http://localhost:3005/${userDetails._id}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    document.editform.editName.value = data.name
    document.editform.editEmail.value  =  data.email 
    document.editform.editPassword.value = data.password
    document.editform.editEmpcode.value = data.empcode
    document.editform.editPhone.value = data.phone
  })
  .catch((error) => {
    console.log('Error:', error);
  })
}

var editEmployee = function(e) {
    event.preventDefault();
    console.log(lastIndex);
    let user = userList[lastIndex];
    let newEmployee = {
      name: document.editform.editName.value,
      email: document.editform.editEmail.value,
      password: document.editform.editPassword.value,
      empcode: document.editform.editEmpcode.value,
      phone: document.editform.editPhone.value 
    }
    fetch(`http://localhost:3005/${user._id}`,{
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: JSON.stringify(newEmployee)
  })
  .then(response => response.json())
  .then(data => {
    getAllEmployeeList();
    console.log('Success:', data);
  })
  .catch((error) => {
    console.log('Error:', error);
  })
}


var createEmployee = function() {
    event.preventDefault();
    var name=document.addform.name.value;
    var email=document.addform.email.value;
    var password=document.addform.password.value;
    var empcode=document.addform.empcode.value;
    var phone=document.addform.phone.value;

    if (name==null || name==""){  
      alert("Name can't be blank");  
      return false;
    }
    if (email==null || email==""){  
      alert("Email can't be blank");  
      return false; 
    }
    if(password.length<6 || password==null){  
      alert("Enter Valid Password.");  
      return false;  
      }  
    if (empcode==null || empcode==""){  
      alert("EMP-Code can't be blank");  
      return false;  
    }
    if (phone==null || phone==""){  
    alert("PhoneNumber can't be blank");  
      return false;  
    }

    let newEmployee = {
      name:name,
      email:email,
      empcode:empcode,
      phone:phone,
      password: password
    }



    console.log(newEmployee,"TEST");

    fetch('http://localhost:3005', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
      body: JSON.stringify(newEmployee)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      getAllEmployeeList();
    })
    .catch((error) => {
      console.log('Error:', error);
    });
    cleanUpEmpAddForm();
}  


var getAllEmployeeList = function(){
  fetch('http://localhost:3005', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    })
    .then(response => response.json())
    .then(data => {
      renderUserList(data);
      userList = data;
      console.log('Success:', data);
    })
    .catch((error) => {
      console.log('Error:', error);
    });
    
}

getAllEmployeeList();




      

       
      
    

    
       





