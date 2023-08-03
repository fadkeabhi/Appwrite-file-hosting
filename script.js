const { Client, Account, ID, Storage, Query } = Appwrite;
const client = new Client();
const account = new Account(client);
const storage = new Storage(client);
const projectId = "64ca936c41b60b35e524";

const limit = 2;

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject(projectId) // Your project ID
    ;

//check for login 
const promise = account.get();

promise.then(function (response) {
    console.log(response); // Success
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('afterLogin').style.display = 'block';
    showFiles(0);
}, function (error) {
    console.log(error); // Failure
});

function logOut() {
    const promise = account.deleteSession('current');
    promise.then(function (response) {
        console.log(response); // Success
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('afterLogin').style.display = 'none';
    }, function (error) {
        console.log(error); // Failure
    });
}




function login() {
    var email = document.getElementById("email").value;
    var pass = document.getElementById("pass").value;
    const promise = account.createEmailSession(email, 'password');

    promise.then(function (response) {
        console.log(response); // Success
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('afterLogin').style.display = 'block';
        showFiles(0);

    }, function (error) {
        console.log(error); // Failure
        alert("Invalid credentials");

    });
}

function upload() {
    var file = document.getElementById('fileInput').files[0];
    if (file) {
        const promise = storage.createFile('files', ID.unique(), document.getElementById('fileInput').files[0]);
        promise.then(function (response) {
            uploaded = true;
            console.log('File uploaded successfully:', response);
            document.getElementById("msg").innerHTML = "<div style='color:green;'>Image uploaded succesfully.</div>";
        }).catch(function (error) {
            document.getElementById("msg").innerHTML = "<div style='color:red;'>File not uploaded.</div>";
            console.error('Error uploading file:', error);
        });

    } else {
        document.getElementById("msg").innerHTML = "<div style='color:red;'>No file selected.</div>";
        console.log('No file selected');
    }
}

function showFiles(page) {
    const promise1 = storage.listFiles('files', queries = [Query.limit(limit), Query.offset(page*limit), Query.orderDesc("$createdAt")])
    promise1.then(function (response) {
        console.log(response); // Success
        if (response.total == 0) {
            //if no record
            document.getElementById("tablearea").innerHTML = "<div style='color:red;'>File not uploaded.</div>";
        }
        else {
            var tablearea = document.getElementById('tablearea'),
                table = document.createElement('table');

            for (var i = 0; i < response.files.length; i++) {
                var tr = document.createElement('tr');

                tr.appendChild(document.createElement('td'));
                const link = document.createElement('a');
                link.href = "https://cloud.appwrite.io/v1/storage/buckets/files/files/" + response.files[i].$id + "/download?project=" + projectId;
                link.target = '_blank';
                link.appendChild(document.createTextNode(response.files[i].name));

                tr.appendChild(document.createElement('td'));

                tr.cells[0].appendChild(document.createTextNode(response.files[i].$createdAt))
                tr.cells[1].appendChild(link);

                table.appendChild(tr);
            }
            document.getElementById("tablearea").innerHTML = "";
            tablearea.appendChild(table);

            //handle multiple pages
            var pages = Math.ceil(response.total/limit);
            var pagingArea = document.getElementById('pagingarea');
            var select = document.createElement('select');
            select.onchange = function() {
                showFiles(this.value-1);
            }
            for(var i=1;i<=pages;i++){
                if(page==i-1){
                    select.add(new Option(i,i,true,true))
                }
                else{
                    select.add(new Option(i,i))
                }
            }
            document.getElementById("pagingarea").innerHTML = "";
            
            pagingArea.appendChild(select);
        }
    }, function (error) {
        console.log(error); // Failure
    });
}

