let existingIDs = [];
let employees = [];

function addEmployee() {
    const emp = takeInputForAddEmployee();
    let isValidEmployee = validateEmployee(emp,"add");
    if(isValidEmployee){
        employees.push(emp);
        existingIDs.push(Number(emp.id));
        displayEmployeeTable();
        clearForm();
    }
}

function takeInputForAddEmployee(){
    const emp_id = document.getElementById("emp_id").value;
    const emp_name = document.getElementById("emp_name").value;
    const emp_age = document.getElementById("emp_age").value;
    const emp_gender = document.getElementById("emp_gender").value;
    const emp = {
        "id": emp_id,
        "name":emp_name, 
        "age": emp_age,
        "gender": emp_gender
    };
    return emp;
}

function validateEmployee(emp,operation){
    let result = false;
    let isValidId = false;
    
    if(operation === "add"){
        isValidId = validateId(emp.id,operation);
    }else if(operation === "update"){
        isValidId = validateId(emp.id,operation,emp.oldId);
    }
    let isValidName = validateName(emp.name,operation);
    let isValidAge = validateAge(emp.age,operation);
    let isValidGender = validateGender(emp.gender,operation);
    
    if (isValidId && isValidName && isValidAge && isValidGender){
        result = true;
    };

    return result;
}

function validateName(name,operation){
    let errorspanId = findElemetId(operation,"name");
    name = name.trim();
    var regex = /^[a-zA-Z ]{2,30}$/;
    let result = regex.test(name);
    if (!result){
        document.getElementById(errorspanId).innerHTML = "Name should contain characters only.";
    }else{
        document.getElementById(errorspanId).innerHTML = "";
    }
    return result;
}

function validateAge(agestr,operation){
    let result = false;
    let errorspanId = findElemetId(operation,"age");
    let age = Number(agestr);         //not string       //integer haii          //valid age grp
    if(!Number.isNaN(age) && Number.isInteger(age) && age>=18 && age<60){
        result = true;
        document.getElementById(errorspanId).innerHTML = "";
    }else{
           document.getElementById(errorspanId).innerHTML = "Age should be between 18 to 60 years.";
        };
    return result;
}

function validateGender(gender,operation){
    let result = false;
    let errorspanId = findElemetId(operation,"gender");
    if(gender === "select"){
        document.getElementById(errorspanId).innerHTML = "Please select gender.";
    }else{
        result = true;
        document.getElementById(errorspanId).innerHTML = "";
    }
    return result; 
}

function validateId(idStr,operation,oldIdStr){
    let result = false;
    let errorspanId = findElemetId(operation,"id");
    let id = Number(idStr);
    if (!Number.isNaN(id) && Number.isInteger(id) && id>0){
        if(operation === "add"){
            let alreadyPresent = isIdAlreadyPresent(id);
            if (!alreadyPresent){
                result = true;
            }else{
                document.getElementById(errorspanId).innerHTML = "ID is used by someone else.";
            }
        } else if(operation === "update"){
            let oldId = Number(oldIdStr);
            if(oldId !== id){
                let alreadyPresent = isIdAlreadyPresent(id);
                if (!alreadyPresent){
                    result = true;
                }else{
                    document.getElementById(errorspanId).innerHTML = "ID is used by someone else.";
                } 
            }else{
                result = true;
            }
        }
    }else{
        document.getElementById(errorspanId).innerHTML = "ID must be a positive integer.";
    }
    if(result){
        document.getElementById(errorspanId).innerHTML = "";
    }
    return result;
}

function isIdAlreadyPresent(id) {
    let alreadyPresent = false;
    for (let index = 0; index < existingIDs.length; index++) {
        let existingID = existingIDs[index];
        if (id === existingID) {
            alreadyPresent = true;
            break;
        }
    }
    return alreadyPresent;
}

function displayEmployeeTable(){
    let tableContent = "";
    for(let index = 0; index < employees.length; index++){
        let employee = employees[index];
        let row = `<tr>
                    <td>${employee.id}</td>
                    <td>${employee.name}</td>
                    <td>${employee.age}</td>
                    <td>${employee.gender}</td>
                    <td><button class="editButton"> <a href="#" onclick="editEmployee('${employee.id}');return false;"><img src="/edit.png" class="icon"/></a></button>  
                    <button class="editButton"><a href="#" onclick="deleteEmployee('${employee.id}');return false;"><img src="/delete.png" class="icon"/></a></button>
                    </td>
                   </tr>`;
        tableContent = tableContent + row;
    }
    document.getElementById("emp_tablebody").innerHTML = tableContent;
}

function clearForm(){
    document.getElementById("idError").innerHTML = "";
    document.getElementById("nameError").innerHTML = "";
    document.getElementById("ageError").innerHTML = "";
    document.getElementById("genderError").innerHTML = "";
    document.getElementById("emp_id").value = "";
    document.getElementById("emp_name").value = "";
    document.getElementById("emp_age").value = "";
    document.getElementById("emp_gender").value = "select";
}

function editEmployee(id){
    document.getElementById("updatePopUp").style.display = "block";
    let employee = findEmployee(id);
    if(employee){
        clearEditForm();
        document.getElementById("edit_emp_id").value = employee.id;
        document.getElementById("edit_emp_name").value = employee.name;
        document.getElementById("edit_emp_age").value = employee.age;
        document.getElementById("edit_emp_gender").value = employee.gender;
        document.getElementById("old_emp_id").value = employee.id;
    }
}

function findEmployee(id){
    let employee = null;
    for (let index = 0; index < employees.length; index++){
        let currentEmployee = employees[index];
        if(currentEmployee.id === id){
            employee = currentEmployee;
            break;
        }
    }
    return employee;
}

function clearEditForm(){
    document.getElementById("editIdError").innerHTML = "";
    document.getElementById("editnameError").innerHTML = "";
    document.getElementById("editageError").innerHTML = "";
    document.getElementById("editgenderError").innerHTML = "";
    document.getElementById("edit_emp_id").value = "";
    document.getElementById("edit_emp_name").value = "";
    document.getElementById("edit_emp_age").value = "";
    document.getElementById("edit_emp_gender").value = "select";
    document.getElementById("old_emp_id").value = "";
}

function updateEmployee(){
    let employee = takeInputForUpdateEmployee();
    let isValidEmployee = validateEmployee(employee,"update");
    if(isValidEmployee){
        removeOldId(employee);
        updateEmployeeArray(employee);
        displayEmployeeTable();
        document.getElementById("updatePopUp").style.display = "none";
        clearEditForm();  
    }
}

function takeInputForUpdateEmployee(){
    const emp_id = document.getElementById("edit_emp_id").value;
    const emp_name = document.getElementById("edit_emp_name").value;
    const emp_age = document.getElementById("edit_emp_age").value;
    const emp_gender = document.getElementById("edit_emp_gender").value;
    const emp_id_old = document.getElementById("old_emp_id").value;

    const emp = {
        "id": emp_id,
        "name":emp_name, 
        "age": emp_age,
        "gender": emp_gender,
        "oldId":emp_id_old
    };
    return emp;
}

function removeOldId(employee) {
    let oldId = Number(employee.oldId);
    let newId = Number(employee.id);
    if (oldId !== newId) {
        let oldIdIndex = existingIDs.indexOf(oldId);
        existingIDs.splice(oldIdIndex, 1);  //will delete the old id at that index
    }
}

function updateEmployeeArray(employee) {
    let employeeIndex = findEmployeeIndex(employee.oldId);
    let employeetoUpdate = {
        "id": employee.id,
        "name": employee.name,
        "age": employee.age,
        "gender": employee.gender
    };
    employees[employeeIndex] = employeetoUpdate;
}

function findEmployeeIndex(id){
    let employeeIndex = null;
    for (let index = 0; index < employees.length; index++){
        let currentEmployee = employees[index];
        if(currentEmployee.id === id){
            employeeIndex = index;
            break;
        }
    }
    return employeeIndex;
}

function cancelUpdate(){
    clearEditForm();
    document.getElementById("updatePopUp").style.display = "none";
}

function deleteEmployee(id){
    let employeeIndex = findEmployeeIndex(id);
    employees.splice(employeeIndex, 1);
    displayEmployeeTable();
}

function findElemetId(operation,field){
    let idName = "";
    if(operation === "add" ){
        switch (field){
            case "id": 
                idName = "idError";
                break;
            case "name":
                idName = "nameError";
                break;
            case "age":
                idName = "ageError";
                break;
            case "gender":
                idName = "genderError";
                break;

        } 
    } else if(operation === "update"){
        switch (field){
            case "id": 
                idName = "editIdError";
                break;
            case "name":
                idName = "editnameError";
                break;
            case "age":
                idName = "editageError";
                break;
            case "gender":
                idName = "editgenderError";
                break;

        } 
    }
    return idName;
}



