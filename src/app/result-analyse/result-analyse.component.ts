import { Component } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TcListComponent } from '../modal/tc-list/tc-list.component';
import { MatDialog } from '@angular/material/dialog';
import { QuestionDataComponent } from '../modal/question-data/question-data.component';
import { AnalysisModalComponent } from '../modal/analysis-modal/analysis-modal.component';

@Component({
  selector: 'app-result-analyse',
  templateUrl: './result-analyse.component.html',
  styleUrls: ['./result-analyse.component.css']
})
export class ResultAnalyseComponent {
  fileToUpload: File | null = null;
  filename: string = '';
  loading = false;
  message = '';
  downloadLink = '';
  responseinJson: any[] = [];
  table = false
  fileId = ''
  constructor(private http: HttpClient, private apiSerivce: ApiService, private dialog: MatDialog) {}

  onFileSelected(event: any): void {
    this.fileToUpload = event.target.files[0] as File;
    console.log(this.fileToUpload.name);
    this.filename = this.fileToUpload.name;
  }

  cancel(): void {
    // refresh the page
    window.location.reload();
  }

  onUpload(): void {
      this.loading = true; // Show loading indicator when request is made
      if (this.fileToUpload) {
        const formData = new FormData();
        formData.append('file', this.fileToUpload);
        // Set up headers to indicate form data
        const headers = new HttpHeaders();
        headers.set('enctype', 'multipart/form-data');
        console.log(formData);

      //   this.responseinJson = [
      //     {
      //         "key": "ebdbfdfabcbbd322260029ddaabadaaone",
      //         "test_Id": "",
      //         "name": "Pravalika Salekula",
      //         "tcList": [
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetClassExists",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManagerClassExists",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetClassPropertiesExist",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManagerClassMethodsExist",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManager_AddPet_Method",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManager_EditPet_Method",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManagerEditPetMethod_NoPetFound",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManagerAddPetMethod_PetAlreadyExists",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_MainMenu_AddPetChoice_ShouldAddPet",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_MainMenu_InvalidChoice_ShouldOutputInvalidMessage",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "MainMenu_Exit_ShouldOutputExitMessage",
      //                 "result": "Compilation Error"
      //             }
      //         ],
      //         "QuestionData": "<p><strong><u>Problem Statement: Pet Management System</u></strong></p><p><br></p><p><strong>Objective:</strong></p><p>You are required to implement a simple pet management system that allows users to add pets, update the details of existing pets, and ensure that each pet has a unique ID. The system will handle basic pet details like name, type (e.g., Dog, Cat, Bird), and age. It will display appropriate error messages for invalid operations, such as adding a pet with an existing ID or trying to edit a non-existent pet. Write all the classes, properties, and methods as public. Implement all the classes, properties, and methods in the <code>Program.cs</code> file.</p><h3><br></h3><h3><strong>Requirements:</strong></h3><p>The program should have the following classes:</p><p><strong>1. PetManager Class:</strong></p><ul><li>Create a class called <code><strong>PetManager</strong></code> that manages the pets in the system.</li><li><strong>Properties:</strong></li><li class=\"ql-indent-1\"><code>pets</code> (Dictionary&lt;int, Pet&gt;): A dictionary that stores all pets in the system using the pet's ID as the key.</li><li><strong>Methods:</strong></li><li class=\"ql-indent-1\"><strong>AddPet(Pet pet):</strong></li><li class=\"ql-indent-2\">Adds a pet to the system.</li><li class=\"ql-indent-2\">Parameters:</li><li class=\"ql-indent-3\"><code><strong>pet</strong></code>: An instance of the <code>Pet</code> class.</li><li class=\"ql-indent-2\">Validation:</li><li class=\"ql-indent-3\">If the pet ID already exists, display the message: <code>\"<strong>A pet with ID {PetId} already exists.</strong>\"</code></li><li class=\"ql-indent-3\">Otherwise, add the pet to the dictionary and display: <code>\"<strong>Pet added successfully.</strong>\"</code></li><li class=\"ql-indent-1\"><strong>EditPet(int petId, string newName, string newType, int newAge):</strong></li><li class=\"ql-indent-2\">Edits the details of an existing pet by ID.</li><li class=\"ql-indent-2\">Parameters:</li><li class=\"ql-indent-3\"><code>petId</code>: The ID of the pet to be edited.</li><li class=\"ql-indent-3\"><code>newName</code>: The new name of the pet.</li><li class=\"ql-indent-3\"><code>newType</code>: The new type of the pet (e.g., Dog, Cat, Bird).</li><li class=\"ql-indent-3\"><code>newAge</code>: The new age of the pet.</li><li class=\"ql-indent-2\">Validation:</li><li class=\"ql-indent-3\">If no pet with the given ID is found, display the message: <code>\"<strong>No pet found with ID {petId}.</strong>\"</code></li><li class=\"ql-indent-3\">Otherwise, update the details and display: <code>\"<strong>Pet details updated successfully.</strong>\"</code></li></ul><p><br></p><p><strong>2. Pet Class:</strong></p><ul><li>Create a class called <code><strong>Pet</strong></code> that represents an individual pet.</li><li><strong>Properties:</strong></li><li class=\"ql-indent-1\"><code>PetId</code> (int): The unique ID of the pet.</li><li class=\"ql-indent-1\"><code>Name</code> (string): The name of the pet.</li><li class=\"ql-indent-1\"><code>Type</code> (string): The type of pet (e.g., Dog, Cat, Bird).</li><li class=\"ql-indent-1\"><code>Age</code> (int): The age of the pet.</li></ul><p><br></p><p><strong>3. Program Class:</strong></p><ul><li>The <code>Program</code> class serves as the entry point for the Pet Management System. It interacts with the <code><strong>PetManager</strong></code> class, managing user input and orchestrating the flow of the application.</li><li>User Input:</li><li class=\"ql-indent-1\">Prompts the user to input pet details such as ID, Name, Type (e.g., Dog, Cat, Bird), and Age.</li><li class=\"ql-indent-1\">Adds the pet to the system using the <code><strong>AddPet()</strong></code> method of the <code><strong>PetManager</strong></code> class.</li><li class=\"ql-indent-1\">Allows the user to edit the details of a pet by ID using the <code><strong>EditPet()</strong></code> method.</li><li class=\"ql-indent-1\">Handles error messages for invalid input or non-existent pets.</li><li>Menu Options:</li><li class=\"ql-indent-1\">Displays a menu with the following options:</li><li class=\"ql-indent-2\"><strong>1. Add Pet</strong>: Allows the user to input details for a new pet.</li><li class=\"ql-indent-2\"><strong>2. Edit Pet by ID</strong>: <span style=\"color: rgb(51, 51, 51);\">Allows the user to edit details for an existing pet.</span></li><li class=\"ql-indent-2\"><strong>3. Exit</strong>: Terminates the application with message as \"<strong>Exiting program...\".</strong></li><li class=\"ql-indent-2\">If any other option is entered, then the error message \"<strong>Invalid choice, please try again.</strong>\" to be displayed.</li></ul><p><br></p><p><strong style=\"color: rgb(51, 51, 51);\">Refer the sample output</strong></p><p>When choice entered is 1, then below has to be displayed.</p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9620653464-1\"></p><p><br></p><p>When choice <span style=\"color: rgb(51, 51, 51);\">entered</span> is 1 and Pet ID is repeated, then below has to be displayed.</p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9620653464-2\"></p><p><br></p><p>When choice <span style=\"color: rgb(51, 51, 51);\">entered</span> is 2, Pet ID to be updated.</p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9174569399-1\"></p><p><br></p><p>When choice <span style=\"color: rgb(51, 51, 51);\">entered</span> is invalid, then below has to be displayed.</p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9620653464-3\"></p><p><br></p><p>When <span style=\"color: rgb(51, 51, 51);\">choice entered is 2 and </span>no pets are added initially, then below has to be displayed. </p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9174569399-2\"></p><p><br></p><p><span style=\"color: rgb(51, 51, 51);\">When choice entered is 3, program has to be exited as below.</span></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9174569399-3\"></p><p><br></p><p><strong>Commands to Run the Project:</strong></p><ul><li><strong>cd dotnetapp</strong></li></ul><p>Select the dotnet project folder</p><ul><li><strong>dotnet run</strong></li></ul><p>To run the application</p><ul><li><strong>dotnet build</strong></li></ul><p>To build and check for errors</p><ul><li><strong>dotnet clean</strong></li></ul><p>If the same error persists clean the project and build again</p>",
      //         "codeComponents": [
      //             {
      //                 "type": "file",
      //                 "name": "Program.cs",
      //                 "code": "using System;\nusing System.Data;\nusing System.Reflection.PortableExecutable;\n\npublic class Program\n{\n    public static void Main(string[] args)\n    {\n        Console.WriteLine(\"Menu\");\n        Console.WriteLine(\"1. Add Pet \\n2. Edit Pet by Id \\n3. Exit\");\n        Console.Write(\"Enter your choice:\");\n        PetManger pm = new PetManger();\n        while (true)\n        {\n            int opt=int.Parse(Console.ReadLine());\n            if(opt==3)\n            {\n                Console.WriteLine(\"Exiting program...\");\n                break;\n            }\n            switch(opt)\n            {\n                case 1:\n                Console.Write(\"Enter Pet by ID: \" );\n                int id=int.Parse(Console.ReadLine());\n\n                Console.Write(\"Enter Pet Name: \" );\n                string nm=Console.ReadLine();\n\n                Console.Write(\"Enter Pet Type: \" );\n                string ty=Console.ReadLine();\n\n                Console.Write(\"Enter Pet Age: \" );\n                int age=int.Parse(Console.ReadLine());\n                Pet p = new Pet();\n                p.PetId=id;\n                p.Name=nm;\n                p.Type=ty;\n                p.Age=age;\n                pm.AddPet(p);\n                break;\n\n                case 2:\n                Console.Write(\"Enter Pet by ID to edit: \" );\n                int id1=int.Parse(Console.ReadLine());\n\n                Console.Write(\"Enter new Pet Name: \" );\n                string nm1=Console.ReadLine();\n\n                Console.Write(\"Enter new Pet Type: \" );\n                string ty1=Console.ReadLine();\n\n                Console.Write(\"Enter new Pet Age: \" );\n                int age1=int.Parse(Console.ReadLine());\n                // Pet p1 = new Pet();                             //id1, nm1, ty1, age1\n                // p1.PetId=id1;\n                // p1.Name=nm1;\n                // p1.Type=ty1;\n                // p1.Age = age1;\n                // pm.EditPet(id1, nm1, ty1, age1);\n                break;\n                default:\n                Console.WriteLine(\"Invalid choice, Please try again\");\n                break;\n            }\n\n        }\n\n    }\n}\npublic class PetManger\n{\n    public static  Dictionary&lt;int,Pet&gt;pets=new Dictionary&lt;int,Pet&gt;();\n    public  void AddPet(Pet pet)\n    {\n        if(pets.ContainsKey(pet.PetId))\n        {\n            Console.WriteLine($\"A pet with ID {pet.PetId} already exists.\");\n        }\n        pets.Add(pet.PetId,pet);\n        Console.WriteLine(\"pet added Successfully.\");\n    }\n    public static void EditPet(int petid,string newName,string newType,int newAge)\n    {\n        // foreach(int key in pets.Keys)\n        // {\n        //     if(key==petid)\n        //     {\n        //         Pet curpet=new Pet();\n        //         curpet.Name=newName;\n        //         curpet.Type=newType;\n        //         curpet.Age=newAge;\n                \n        //     }\n        //     Console.WriteLine($\"No pet found with Id{petid}\");\n        // }\n        // Console.WriteLine(\"Pet details updated successfully.\");\n\n    }   \n}\npublic class Pet\n{\n    public  int PetId{get;set;}\n    public string Name{get;set;}\n    public string Type{get;set;}\n    public int Age{get;set;}\n    \n    \n\n\n}\n"
      //             }
      //         ],
      //         "aiAnalysis": "Failure Analysis:\n\n1. The provided solution file is incomplete and contains multiple compilation errors. The `Program` class is missing the `PetManger` instance method to edit pets.\n2. In the `PetManger` class, the `EditPet` method is not correctly implemented. It should iterate through the dictionary and find the pet with the matching ID, then update its details.\n3. The `Pet` class constructor and setter methods are missing. The `Pet` class should have a parameterized constructor to initialize the pet properties and setter methods to update them.\n4. The `PetManager` instance method `AddPet` should throw an error when a pet with an existing ID is added.\n\nFinal Analysis:\nThe provided solution file has several compilation errors and logical implementation errors. The `PetManger` class's `EditPet` method is not correctly implemented, and the `Pet` class lacks constructor and setter methods. The `PetManager` class's `AddPet` method does not handle the case when a pet with an existing ID is added."
      //     },
      //     {
      //         "key": "ccafaabebeeec322260025ddaabadaaone",
      //         "test_Id": "https://admin.ltimindtree.iamneo.ai/result?testId=U2FsdGVkX1%2BpL%2BuGpm74aWRSfvPPdQkxiWFzTyNtxvECzvGAW%2FiGDFt0fBsQznzAoDEq%2FXCGksN%2FPvZ79MpZH1chwvSPUg5OVEOYYy1%2BSykBrsNMjFVQIKDxjpVpJLJ5dYXz0NfoUIZtFsH%2BR7KV9w%3D%3D",
      //         "name": "Preetam Kuchlan",
      //         "tcList": [
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetClassExists",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManagerClassExists",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetClassPropertiesExist",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManagerClassMethodsExist",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManager_AddPet_Method",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManager_EditPet_Method",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManagerEditPetMethod_NoPetFound",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManagerAddPetMethod_PetAlreadyExists",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_MainMenu_AddPetChoice_ShouldAddPet",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_MainMenu_InvalidChoice_ShouldOutputInvalidMessage",
      //                 "result": "Compilation Error"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "MainMenu_Exit_ShouldOutputExitMessage",
      //                 "result": "Compilation Error"
      //             }
      //         ],
      //         "QuestionData": "<p><strong><u>Problem Statement: Pet Management System</u></strong></p><p><br></p><p><strong>Objective:</strong></p><p>You are required to implement a simple pet management system that allows users to add pets, update the details of existing pets, and ensure that each pet has a unique ID. The system will handle basic pet details like name, type (e.g., Dog, Cat, Bird), and age. It will display appropriate error messages for invalid operations, such as adding a pet with an existing ID or trying to edit a non-existent pet. Write all the classes, properties, and methods as public. Implement all the classes, properties, and methods in the <code>Program.cs</code> file.</p><h3><br></h3><h3><strong>Requirements:</strong></h3><p>The program should have the following classes:</p><p><strong>1. PetManager Class:</strong></p><ul><li>Create a class called <code><strong>PetManager</strong></code> that manages the pets in the system.</li><li><strong>Properties:</strong></li><li class=\"ql-indent-1\"><code>pets</code> (Dictionary&lt;int, Pet&gt;): A dictionary that stores all pets in the system using the pet's ID as the key.</li><li><strong>Methods:</strong></li><li class=\"ql-indent-1\"><strong>AddPet(Pet pet):</strong></li><li class=\"ql-indent-2\">Adds a pet to the system.</li><li class=\"ql-indent-2\">Parameters:</li><li class=\"ql-indent-3\"><code><strong>pet</strong></code>: An instance of the <code>Pet</code> class.</li><li class=\"ql-indent-2\">Validation:</li><li class=\"ql-indent-3\">If the pet ID already exists, display the message: <code>\"<strong>A pet with ID {PetId} already exists.</strong>\"</code></li><li class=\"ql-indent-3\">Otherwise, add the pet to the dictionary and display: <code>\"<strong>Pet added successfully.</strong>\"</code></li><li class=\"ql-indent-1\"><strong>EditPet(int petId, string newName, string newType, int newAge):</strong></li><li class=\"ql-indent-2\">Edits the details of an existing pet by ID.</li><li class=\"ql-indent-2\">Parameters:</li><li class=\"ql-indent-3\"><code>petId</code>: The ID of the pet to be edited.</li><li class=\"ql-indent-3\"><code>newName</code>: The new name of the pet.</li><li class=\"ql-indent-3\"><code>newType</code>: The new type of the pet (e.g., Dog, Cat, Bird).</li><li class=\"ql-indent-3\"><code>newAge</code>: The new age of the pet.</li><li class=\"ql-indent-2\">Validation:</li><li class=\"ql-indent-3\">If no pet with the given ID is found, display the message: <code>\"<strong>No pet found with ID {petId}.</strong>\"</code></li><li class=\"ql-indent-3\">Otherwise, update the details and display: <code>\"<strong>Pet details updated successfully.</strong>\"</code></li></ul><p><br></p><p><strong>2. Pet Class:</strong></p><ul><li>Create a class called <code><strong>Pet</strong></code> that represents an individual pet.</li><li><strong>Properties:</strong></li><li class=\"ql-indent-1\"><code>PetId</code> (int): The unique ID of the pet.</li><li class=\"ql-indent-1\"><code>Name</code> (string): The name of the pet.</li><li class=\"ql-indent-1\"><code>Type</code> (string): The type of pet (e.g., Dog, Cat, Bird).</li><li class=\"ql-indent-1\"><code>Age</code> (int): The age of the pet.</li></ul><p><br></p><p><strong>3. Program Class:</strong></p><ul><li>The <code>Program</code> class serves as the entry point for the Pet Management System. It interacts with the <code><strong>PetManager</strong></code> class, managing user input and orchestrating the flow of the application.</li><li>User Input:</li><li class=\"ql-indent-1\">Prompts the user to input pet details such as ID, Name, Type (e.g., Dog, Cat, Bird), and Age.</li><li class=\"ql-indent-1\">Adds the pet to the system using the <code><strong>AddPet()</strong></code> method of the <code><strong>PetManager</strong></code> class.</li><li class=\"ql-indent-1\">Allows the user to edit the details of a pet by ID using the <code><strong>EditPet()</strong></code> method.</li><li class=\"ql-indent-1\">Handles error messages for invalid input or non-existent pets.</li><li>Menu Options:</li><li class=\"ql-indent-1\">Displays a menu with the following options:</li><li class=\"ql-indent-2\"><strong>1. Add Pet</strong>: Allows the user to input details for a new pet.</li><li class=\"ql-indent-2\"><strong>2. Edit Pet by ID</strong>: <span style=\"color: rgb(51, 51, 51);\">Allows the user to edit details for an existing pet.</span></li><li class=\"ql-indent-2\"><strong>3. Exit</strong>: Terminates the application with message as \"<strong>Exiting program...\".</strong></li><li class=\"ql-indent-2\">If any other option is entered, then the error message \"<strong>Invalid choice, please try again.</strong>\" to be displayed.</li></ul><p><br></p><p><strong style=\"color: rgb(51, 51, 51);\">Refer the sample output</strong></p><p>When choice entered is 1, then below has to be displayed.</p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9620653464-1\"></p><p><br></p><p>When choice <span style=\"color: rgb(51, 51, 51);\">entered</span> is 1 and Pet ID is repeated, then below has to be displayed.</p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9620653464-2\"></p><p><br></p><p>When choice <span style=\"color: rgb(51, 51, 51);\">entered</span> is 2, Pet ID to be updated.</p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9174569399-1\"></p><p><br></p><p>When choice <span style=\"color: rgb(51, 51, 51);\">entered</span> is invalid, then below has to be displayed.</p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9620653464-3\"></p><p><br></p><p>When <span style=\"color: rgb(51, 51, 51);\">choice entered is 2 and </span>no pets are added initially, then below has to be displayed. </p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9174569399-2\"></p><p><br></p><p><span style=\"color: rgb(51, 51, 51);\">When choice entered is 3, program has to be exited as below.</span></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9174569399-3\"></p><p><br></p><p><strong>Commands to Run the Project:</strong></p><ul><li><strong>cd dotnetapp</strong></li></ul><p>Select the dotnet project folder</p><ul><li><strong>dotnet run</strong></li></ul><p>To run the application</p><ul><li><strong>dotnet build</strong></li></ul><p>To build and check for errors</p><ul><li><strong>dotnet clean</strong></li></ul><p>If the same error persists clean the project and build again</p>",
      //         "codeComponents": [],
      //         "aiAnalysis": "No solution is fetched"
      //     },
      //     {
      //         "key": "afaacbdceeb322259833ddaabadaaone",
      //         "test_Id": "",
      //         "name": "Raj Shekhar",
      //         "tcList": [
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetClassExists",
      //                 "result": "Success"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManagerClassExists",
      //                 "result": "Success"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetClassPropertiesExist",
      //                 "result": "Success"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManagerClassMethodsExist",
      //                 "result": "Success"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManager_AddPet_Method",
      //                 "result": "Failure"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManager_EditPet_Method",
      //                 "result": "Failure"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManagerEditPetMethod_NoPetFound",
      //                 "result": "Failure"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_PetManagerAddPetMethod_PetAlreadyExists",
      //                 "result": "Failure"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_MainMenu_AddPetChoice_ShouldAddPet",
      //                 "result": "Failure"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "Test_MainMenu_InvalidChoice_ShouldOutputInvalidMessage",
      //                 "result": "Success"
      //             },
      //             {
      //                 "evaluation_type": "NUnit",
      //                 "name": "MainMenu_Exit_ShouldOutputExitMessage",
      //                 "result": "Success"
      //             }
      //         ],
      //         "QuestionData": "<p><strong><u>Problem Statement: Pet Management System</u></strong></p><p><br></p><p><strong>Objective:</strong></p><p>You are required to implement a simple pet management system that allows users to add pets, update the details of existing pets, and ensure that each pet has a unique ID. The system will handle basic pet details like name, type (e.g., Dog, Cat, Bird), and age. It will display appropriate error messages for invalid operations, such as adding a pet with an existing ID or trying to edit a non-existent pet. Write all the classes, properties, and methods as public. Implement all the classes, properties, and methods in the <code>Program.cs</code> file.</p><h3><br></h3><h3><strong>Requirements:</strong></h3><p>The program should have the following classes:</p><p><strong>1. PetManager Class:</strong></p><ul><li>Create a class called <code><strong>PetManager</strong></code> that manages the pets in the system.</li><li><strong>Properties:</strong></li><li class=\"ql-indent-1\"><code>pets</code> (Dictionary&lt;int, Pet&gt;): A dictionary that stores all pets in the system using the pet's ID as the key.</li><li><strong>Methods:</strong></li><li class=\"ql-indent-1\"><strong>AddPet(Pet pet):</strong></li><li class=\"ql-indent-2\">Adds a pet to the system.</li><li class=\"ql-indent-2\">Parameters:</li><li class=\"ql-indent-3\"><code><strong>pet</strong></code>: An instance of the <code>Pet</code> class.</li><li class=\"ql-indent-2\">Validation:</li><li class=\"ql-indent-3\">If the pet ID already exists, display the message: <code>\"<strong>A pet with ID {PetId} already exists.</strong>\"</code></li><li class=\"ql-indent-3\">Otherwise, add the pet to the dictionary and display: <code>\"<strong>Pet added successfully.</strong>\"</code></li><li class=\"ql-indent-1\"><strong>EditPet(int petId, string newName, string newType, int newAge):</strong></li><li class=\"ql-indent-2\">Edits the details of an existing pet by ID.</li><li class=\"ql-indent-2\">Parameters:</li><li class=\"ql-indent-3\"><code>petId</code>: The ID of the pet to be edited.</li><li class=\"ql-indent-3\"><code>newName</code>: The new name of the pet.</li><li class=\"ql-indent-3\"><code>newType</code>: The new type of the pet (e.g., Dog, Cat, Bird).</li><li class=\"ql-indent-3\"><code>newAge</code>: The new age of the pet.</li><li class=\"ql-indent-2\">Validation:</li><li class=\"ql-indent-3\">If no pet with the given ID is found, display the message: <code>\"<strong>No pet found with ID {petId}.</strong>\"</code></li><li class=\"ql-indent-3\">Otherwise, update the details and display: <code>\"<strong>Pet details updated successfully.</strong>\"</code></li></ul><p><br></p><p><strong>2. Pet Class:</strong></p><ul><li>Create a class called <code><strong>Pet</strong></code> that represents an individual pet.</li><li><strong>Properties:</strong></li><li class=\"ql-indent-1\"><code>PetId</code> (int): The unique ID of the pet.</li><li class=\"ql-indent-1\"><code>Name</code> (string): The name of the pet.</li><li class=\"ql-indent-1\"><code>Type</code> (string): The type of pet (e.g., Dog, Cat, Bird).</li><li class=\"ql-indent-1\"><code>Age</code> (int): The age of the pet.</li></ul><p><br></p><p><strong>3. Program Class:</strong></p><ul><li>The <code>Program</code> class serves as the entry point for the Pet Management System. It interacts with the <code><strong>PetManager</strong></code> class, managing user input and orchestrating the flow of the application.</li><li>User Input:</li><li class=\"ql-indent-1\">Prompts the user to input pet details such as ID, Name, Type (e.g., Dog, Cat, Bird), and Age.</li><li class=\"ql-indent-1\">Adds the pet to the system using the <code><strong>AddPet()</strong></code> method of the <code><strong>PetManager</strong></code> class.</li><li class=\"ql-indent-1\">Allows the user to edit the details of a pet by ID using the <code><strong>EditPet()</strong></code> method.</li><li class=\"ql-indent-1\">Handles error messages for invalid input or non-existent pets.</li><li>Menu Options:</li><li class=\"ql-indent-1\">Displays a menu with the following options:</li><li class=\"ql-indent-2\"><strong>1. Add Pet</strong>: Allows the user to input details for a new pet.</li><li class=\"ql-indent-2\"><strong>2. Edit Pet by ID</strong>: <span style=\"color: rgb(51, 51, 51);\">Allows the user to edit details for an existing pet.</span></li><li class=\"ql-indent-2\"><strong>3. Exit</strong>: Terminates the application with message as \"<strong>Exiting program...\".</strong></li><li class=\"ql-indent-2\">If any other option is entered, then the error message \"<strong>Invalid choice, please try again.</strong>\" to be displayed.</li></ul><p><br></p><p><strong style=\"color: rgb(51, 51, 51);\">Refer the sample output</strong></p><p>When choice entered is 1, then below has to be displayed.</p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9620653464-1\"></p><p><br></p><p>When choice <span style=\"color: rgb(51, 51, 51);\">entered</span> is 1 and Pet ID is repeated, then below has to be displayed.</p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9620653464-2\"></p><p><br></p><p>When choice <span style=\"color: rgb(51, 51, 51);\">entered</span> is 2, Pet ID to be updated.</p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9174569399-1\"></p><p><br></p><p>When choice <span style=\"color: rgb(51, 51, 51);\">entered</span> is invalid, then below has to be displayed.</p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9620653464-3\"></p><p><br></p><p>When <span style=\"color: rgb(51, 51, 51);\">choice entered is 2 and </span>no pets are added initially, then below has to be displayed. </p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9174569399-2\"></p><p><br></p><p><span style=\"color: rgb(51, 51, 51);\">When choice entered is 3, program has to be exited as below.</span></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/9174569399-3\"></p><p><br></p><p><strong>Commands to Run the Project:</strong></p><ul><li><strong>cd dotnetapp</strong></li></ul><p>Select the dotnet project folder</p><ul><li><strong>dotnet run</strong></li></ul><p>To run the application</p><ul><li><strong>dotnet build</strong></li></ul><p>To build and check for errors</p><ul><li><strong>dotnet clean</strong></li></ul><p>If the same error persists clean the project and build again</p>",
      //         "codeComponents": [
      //             {
      //                 "type": "file",
      //                 "name": "Program.cs",
      //                 "code": "using System;\nusing System.Security.Cryptography.X509Certificates;\nusing System.Collections.Generic;\n\npublic class Program\n{\n    public static void Main(string[] args)\n    {\n      \n       Console.WriteLine(\"Menu:\");\n       Console.WriteLine(\"1. Add Pet\");\n       Console.WriteLine(\"2. Edit Pet by ID\");\n       Console.WriteLine(\"3. Exit\");\n       \n       string opt = Console.ReadLine();\n      // while(true){\n        switch(opt){\n            case \"1\" :\n\n            break;\n\n            case \"2\" :\n            break;\n\n            case \"3\" :\n            Console.WriteLine(\"Exiting program...\");\n            return;\n\n            default:\n            Console.WriteLine(\"Invalid choice, please try again.\");\n            break;\n\n            \n        }\n       }\n    }\n    \npublic class PetManager{\n   public int ID{get; set;} \n    //Dictionary&lt;int, Pet&gt;() \n\npublic void AddPet(Pet pet){\n\n\n//PetId = int.Parse(Console.ReadLine());\n//if(ID == PetId){\n    \n//Console.WriteLine($\"A pet with ID {PetId} already exists\");\n\n}\npublic void EditPet(int petId, string newName, string newType, int newAge){\n\n}\n\n\n}\npublic class Pet{\n\n//public Pet()\n    public int PetId{get; set;} \n    public string Name {get; set;}\n    public string Type {get; set;}\n    public int Age {get; set;}\n}\n\n"
      //             }
      //         ],
      //         "aiAnalysis": "Analysis:\n\n1. In the Program class, the switch statement is outside the loop, which means it will only run once and then exit the program. This is not in line with the description, which expects the program to continuously prompt the user for input until they choose to exit.\n\nFailure analysis: The program does not continuously prompt the user for input until they choose to exit, as expected.\n\n2. The PetManager class does not have a dictionary to store pets. The description mentions a Dictionary<int, Pet> pets.\n\nFailure analysis: The pet manager class does not have a dictionary to store pets, which is necessary for managing pets.\n\n3. The AddPet method does not validate if the pet ID already exists. The description mentions validating if the pet ID already exists.\n\nFailure analysis: The AddPet method does not validate if the pet ID already exists, which means it will add a pet with an already existing ID.\n\n4. The EditPet method does not find the pet by ID and update its details. The description mentions finding the pet by ID and updating its details.\n\nFailure analysis: The EditPet method does not find the pet by ID and update its details, which means it will not update the details of an existing pet.\n\nFinal analysis: The provided solution is incomplete and has several logical errors. It does not continuously prompt the user for input, does not store pets in a dictionary, does not validate pet IDs, and does not update pet details. The code needs to be refactored tofix these issues."
      //     }
      // ]

        this.apiSerivce.uploadexcel(formData).subscribe(
          (response) => {
            this.loading = false;
            console.log('Upload successful:', response);
            this.table = true;
            this.message = response.message;
            this.downloadLink = response.downloadLink;
            this.fileId = response.fileId;
            this.responseinJson = response.responseinJson.map((item: any) => {
              if (typeof item.tcList === 'string') {
                item.tcList = JSON.parse(item.tcList); // Parse tcList if it's a string
              }
              return item;
            });

            console.log('Parsed responseinJson:', this.responseinJson);
            // this.openResultDialog(response);


            // this.responseText = JSON.stringify(response.jsonObjects, null, 2);
            // console.log(this.responseText);

          },
          (error) => {
            console.error('Upload failed:', error);
          // this.download = false;
          // this.downloadsh = false;

          //   this.responseText = 'Upload failed';
          }
        ).add(() => {
          this.loading = false; // Hide loading indicator when request completes
        });
      }
    }

    openModal(tcList: any[]): void {
      this.OpenTcListDialog(tcList);
    }
    openQuestionModal(question: any[]): void {
      this.openQuestionDialog(question);
    }
    openAnalysisModal(analysis: any[]): void {
      this.openAnalysisDialog(analysis);
    }

    OpenTcListDialog(response: any): void {
        console.log(response);

        const dialogRef = this.dialog.open(TcListComponent, {
          width: '400px',
          data: { response,testcases: response },
          // data: { testcases: response },
          // panelClass: 'custom-dialog-container', // Add a custom class for styling
        });

        dialogRef.afterClosed().subscribe((result: { testcases: any[] }) => {
          if (result) {
            // Save the changes if needed
            console.log('Testcase edited:', result);
          }
        });
        // dialogRef.componentInstance.dataEditedEvent.subscribe((editedData: any) => {
        //   console.log('Edited data:', editedData);
        //   this.responseText = JSON.stringify(editedData, null, 2);

        // });

      }

      openQuestionDialog(response: any): void {
        const dialogRef = this.dialog.open(QuestionDataComponent, {
          width: '400px',
          data: { response,testcases: response },
         });

        dialogRef.afterClosed().subscribe((result: { testcases: any[] }) => {
          if (result) {
            console.log('Testcase edited:', result);
          }
        });

      }
      openAnalysisDialog(response: any): void {
        const dialogRef = this.dialog.open(AnalysisModalComponent, {
          width: '400px',
          data: { response,testcases: response },
         });

        dialogRef.afterClosed().subscribe((result: { testcases: any[] }) => {
          if (result) {
            console.log('Testcase edited:', result);
          }
        });

      }

      downloadFile(fileId: string): void {
        this.http.get(`https://backend-projectanalyzer.onrender.com/download/${fileId}`, { responseType: 'blob' })
          .subscribe((response: Blob) => {
            // Create a temporary link element
            const url = window.URL.createObjectURL(response);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'response-analysis.xlsx';  // Set default file name
            document.body.appendChild(a);
            a.click();  // Trigger the download
            document.body.removeChild(a);  // Clean up
            window.URL.revokeObjectURL(url);  // Release the object URL
          }, error => {
            console.error('Download failed', error);
            alert('Failed to download the file.');
          });
      }




}
