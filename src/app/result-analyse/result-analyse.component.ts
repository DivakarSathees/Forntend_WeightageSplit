import { Component, OnInit } from '@angular/core';
import { ApiService } from '../Services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TcListComponent } from '../modal/tc-list/tc-list.component';
import { MatDialog } from '@angular/material/dialog';
import { QuestionDataComponent } from '../modal/question-data/question-data.component';
import { AnalysisModalComponent } from '../modal/analysis-modal/analysis-modal.component';
import { PageEvent } from '@angular/material/paginator';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { LogListComponent } from '../modal/log-list/log-list.component';
import { SolutionModalComponent } from '../modal/solution-modal/solution-modal.component';


@Component({
  selector: 'app-result-analyse',
  templateUrl: './result-analyse.component.html',
  styleUrls: ['./result-analyse.component.css'],
  animations: [
    trigger('fadeInOut', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'translateX(0px)',
        })
      ),
      state(
        '*',
        style({
          opacity: 1,
          transform: 'translateX(0)',
        })
      ),
      transition(':enter', [animate('500ms ease-in')]),
      transition(':leave', [animate('0ms ease-out')]),
    ]),
  ],
})
export class ResultAnalyseComponent  implements OnInit {
  fileToUpload: File | null = null;
  filename: string = '';
  loading = false;
  message = '';
  downloadLink = '';
  responseinJson: any[] = [];
  paginatedData: any[] = [];
  pageSize = 5; // Default page size
  currentPage = 0; // Default to first page
  table = false
  fileId = ''
  errorMessage = ''
  processMessage = ''
  mess = false;
  authType = "credentials"
  analysisType: string = ''; // To store the selected analysis type
  email: string = ''; // For email input
  password: string = ''; // For password input
  token: string = ''; // For token input

  displayedColumns: string[] = [
    'name',
    'testId',
    'testCases',
    'questionData',
    'logData',
    'solution',
    'analysis',
    'testSubmittedTime',
    'sonarAddedTime',
    'differenceInSubmission',
  ];

  constructor(private http: HttpClient, private apiSerivce: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    // Load saved values from localStorage
    this.email = localStorage.getItem('email') || '';
    this.password = localStorage.getItem('password') || '';
    this.token = localStorage.getItem('token') || '';
    this.authType = localStorage.getItem('authType') || 'credentials';
  }

  onFileSelected(event: any): void {
    this.fileToUpload = event.target.files[0] as File;
    console.log(this.fileToUpload.name);
    this.filename = this.fileToUpload.name;
  }
  onAuthTypeChange(type: string) {
    this.authType = type;
  }

  onAnalysisTypeChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.analysisType = input.value;
    console.log('Selected Analysis Type:', this.analysisType);
  }


  cancel(): void {
    // refresh the page
    window.location.reload();
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.mess = true;

    // Clear the error message after 10 seconds
    setTimeout(() => {
      this.errorMessage = '';
      this.mess = false
    }, 3000); // 10000ms = 10 seconds
  }
  showProcess(message: string): void {
    this.processMessage = message;
    this.mess = true;

    // Clear the error message after 10 seconds
    setTimeout(() => {
      this.processMessage = '';
      this.mess = false
    }, 3000); // 10000ms = 10 seconds
  }

  Back(){
    this.table = false
  }
  Next(){
    this.table = true
  }

  onUpload(): void {
    localStorage.setItem('email', this.email);
    localStorage.setItem('password', this.password);
    localStorage.setItem('token', this.token);
    if (!this.fileToUpload){
      this.errorMessage = 'Please select a file before uploading.';
      this.mess = true

      setTimeout(() => {
        this.errorMessage = '';
      this.mess = false
      }, 3000); // 10 seconds
      return;
    }

      this.loading = true; // Show loading indicator when request is made
      if (this.fileToUpload) {
        const formData = new FormData();
        formData.append('file', this.fileToUpload);
        formData.append('analysisType', this.analysisType);
        formData.append('email', this.email);
        formData.append('password', this.password);
        formData.append('token', this.token);
        // Set up headers to indicate form data
        const headers = new HttpHeaders();
        headers.set('enctype', 'multipart/form-data');
        console.log(formData);

    //     this.loading = false;
    //         this.table = true;

    //   this.responseinJson = [
    //     {
    //         "key": "cbdeaeeec322385779bebfcfabddcafafecone",
    //         "test_Id": "",
    //         "name": "Manan Joshi",
    //         "tcList": [
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CreateEmployee_ReturnsCreatedEmploye",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "SearchEmployeeByName_ReturnsEmployeeWithTaskItems",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CreateTaskItem_ReturnsCreatedTaskWithEmployeeDetails",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "GetTaskById_ReturnsTaskWithEmployeeDetails",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "DeleteTaskItem_ReturnsNoContent",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "DeleteTaskItem_InvalidId_ReturnsNotFound",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "GetTaskItems_ReturnsListOfTaskItemsWithEmployees",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "GetTaskItemById_InvalidId_ReturnsNotFound",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "EmployeeModel_HasAllProperties",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "TaskItemModel_HasAllProperties",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "DbContext_HasDbSetProperties",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "EmployeeTask_Relationship_IsConfiguredCorrectly",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CreateEmployee_ThrowsEmployeeException_ForShortName",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CreateEmployee_ThrowsEmployeeException_ForInvalidShortName",
    //                 "result": "Failure"
    //             }
    //         ],
    //         "QuestionData": "<p><strong>Task Management System API</strong></p><p><br></p><p><strong>Problem Statement:</strong></p><p>Develop a WEB API project for a task management system using <strong>ASP.NET Core. </strong>The API will provide services for managing tasks and employees. Your task is to design and implement the API based on the given requirements, focusing on action methods, controllers, endpoints, and appropriate status codes.</p><p><br></p><p><strong>Models:</strong></p><ul><li>Create a folder named Models. </li><li>You will define two models: <strong>Employee</strong> and <strong>TaskItem</strong>. These models represent the structure of the data you’ll be working with.</li></ul><p><br></p><ol><li><strong>Employee.cs:</strong></li></ol><ul><li class=\"ql-indent-1\"><strong>EmployeeId: int </strong>- Unique identifier for each employee.</li><li class=\"ql-indent-1\"><strong>Name: string</strong> - Name of the employee.</li><li class=\"ql-indent-1\"><strong>Email: string</strong> - Email address of the employee.</li><li class=\"ql-indent-1\"><strong>PhoneNumber: string</strong> - Phone number of the employee.</li><li class=\"ql-indent-1\"><strong>Department: string</strong> - Department where the employee works.</li><li class=\"ql-indent-1\"><strong>TaskItems (ICollection&lt;TaskItem&gt;?): </strong>A collection of task items assigned to the employee. The<strong> [JsonIgnore]</strong> attribute is applied to this property, indicating that it should be excluded from JSON serialization.</li></ul><p><br></p><p><strong>\t\t2.TaskItem.cs:</strong></p><ul><li class=\"ql-indent-1\"><strong>TaskItemId: int </strong>- Unique identifier for each task item.</li><li class=\"ql-indent-1\"><strong>Title: string </strong>- Title of the task item.</li><li class=\"ql-indent-1\"><strong>Description: string</strong> - Detailed description of the task item.</li><li class=\"ql-indent-1\"><strong>DueDate: string </strong>- Deadline for the task item.</li><li class=\"ql-indent-1\"><strong>Priority: string </strong>- Priority level of the task item(e.g., Low, Medium, High).</li><li class=\"ql-indent-1\"><strong>EmployeeId: int -</strong> Foreign key linking to the Employee entity. This establishes a <strong>many-to-one relationship</strong> where multiple tasks can be assigned to one employee.</li><li class=\"ql-indent-1\"><strong>Employee?:</strong> Optional reference to the Employee entity associated with the task item.</li></ul><p><br></p><p><br></p><p><strong>Using ApplicationDbContext for Employee and Task Management</strong></p><p><br></p><p>Using <strong>ApplicationDbContext</strong> for Employee and Task Management. <strong>ApplicationDbContext</strong> must be present inside the folder Data. </p><p><strong>Namespace - dotnetapp.Data</strong></p><p><br></p><p>The ApplicationDbContext class acts as the primary interface between the application and the database, managing CRUD operations for Employee entities and (Create, Read, Update, Delete) operations for <strong>Task</strong> entities. This context class defines the database schema through its DbSet properties and manages the <strong>one-to-many relationship</strong> between <strong>Employee</strong> and <strong>Task</strong>.</p><p><br></p><p><strong>DbSet Properties:</strong></p><p><br></p><p><strong>DbSet&lt;Employee&gt; Employees:</strong></p><ul><li>Represents a collection of Employee entities stored in the Employees table.</li><li>Each Employee can have multiple associated TaskItem entries, defining a <strong>one-to-many relationship</strong> where one employee can be linked to many task items.</li></ul><p><br></p><p><strong>DbSet&lt;TaskItem&gt; TaskItems:</strong></p><ul><li>Represents a collection of Task entities stored in the Task Items table.</li><li>Each Task Item is linked to one employee, establishing a<strong> many-to-one relationship</strong> where many task items can be assigned to a single employee.</li></ul><p><br></p><p><br></p><p><strong>One-to-Many Relationship:</strong></p><p><br></p><p><strong>Employee to TaskItem:</strong></p><ul><li><strong>One-to-Many:</strong> Each Employee can have multiple <strong>Task Items</strong>.</li><li class=\"ql-indent-1\">Configure the <strong>OnModelCreating</strong> using:</li><li class=\"ql-indent-1\">Specify that each <strong>TaskItem</strong> can have multiple <strong>Employees</strong>.</li><li class=\"ql-indent-2\">Specify that each <strong>Employee</strong> can have many <strong>TaskItems</strong>.</li><li class=\"ql-indent-2\">Configure the foreign key relationship from <strong>TaskItem</strong> to <strong>Employee</strong>.</li><li class=\"ql-indent-2\">Configure cascading delete behavior, meaning if a <strong>Employee</strong> is deleted, their associated <strong>TaskItems</strong> will also be deleted.</li></ul><p><br></p><p><strong>Implement the actual logic in the controller:</strong></p><p><br></p><p><strong>Controllers: Namespace: dotnetapp.Controllers</strong></p><p><br></p><p><strong>TaskItemController</strong></p><p><br></p><ul><li><strong>GetTaskItems()</strong> - Retrieves a list of all task items along with their associated employee details. If no task items are found, it returns a <strong>204 No Content</strong>. Otherwise, it returns a <strong>200 OK </strong>with a list of task items and their related employee details.</li><li><strong>GetTaskItem(int id)</strong> - Retrieves a single task item by its <strong>TaskItemId</strong> along with its associated employee details. If the task item is not found, it returns a <strong>404 Not Found</strong>. If found, it returns a<strong> 200 OK</strong> with the task and its related employee details.</li><li><strong>CreateTaskItem([FromBody] TaskItem taskItem) </strong>- Adds a new task item to the database. If the <strong>EmployeeId</strong> is not valid, it returns a<strong> 400 Bad Request</strong>. Upon successful creation, it returns a<strong> 201 Created</strong> with the object of the newly created task item.</li><li><strong>DeleteTaskItem(int id)</strong> - Deletes the task item identified by <strong>id</strong>. If the task item is not found, it returns a <strong>404 Not Found</strong>. Upon successful deletion, it returns a <strong>204 No Content.</strong></li></ul><p><br></p><p><strong>EmployeeController</strong></p><p><br></p><ul><li><strong>CreateEmployee([FromBody] Employee employee)</strong> - Adds a new employee to the database. Upon successful creation, it returns a <strong>201 Created </strong>with the object of the newly created employee. If the employee's Name is less than 3 characters long, an <strong>EmployeeException</strong> is thrown, resulting in a <strong>500 StatusCode</strong> response with the message: \"<strong>Employee name should be at least 3 characters long</strong>\".</li><li><strong>SearchEmployeeByName(string name)</strong> - Retrieves employees whose names start with the given prefix. The <strong>prefix</strong> is derived from the <strong>first 3 characters </strong>of the provided name. If the name is less than 3 characters long, or no employees match the search, appropriate error responses are returned. <strong>200 OK</strong> returns a list of employees whose names start with the provided prefix, along with their associated tasks.<strong> 400 Bad Request</strong> is returned if the name parameter is less than 3 characters long. <strong>404 Not Found</strong> is returned if no employees match the search criteria.</li></ul><p><br></p><p><strong>Exceptions</strong></p><p><strong>EmployeeException:</strong></p><p><strong>Description:</strong> A custom exception thrown when the employee's name does not meet validation criteria, such as being <strong>less than 3 characters long. </strong>This exception provides a specific error message related to employee name validation.</p><p><strong>Namespace: dotnetapp.Exceptions</strong></p><p><strong>Usage: </strong>Thrown in the <strong>CreateEmployee</strong> method if the employee's name is too short.</p><p><br></p><p><strong>Endpoints:</strong></p><p><strong>TaskItems:</strong></p><ul><li><strong>GET /api/TaskItem</strong> - Retrieve a list of all task items, including their associated employees.</li><li><strong>GET /api/TaskItem/{id}</strong> - Retrieve a specific task item by its ID, including its associated employees.</li><li><strong>POST /api/TaskItem </strong>- Create a new task item. Requires a Employees collection.</li><li><strong>DELETE /api/TaskItem/{id}</strong> - Delete a task item by its ID.</li></ul><p><br></p><p><strong>Employees:</strong></p><ul><li><strong>POST /api/Employee -</strong> Create a new employee.</li><li><strong>GET /api/Employee/Search?name={employeeName} - </strong>Search for employees by name prefix.</li></ul><p><br></p><p><strong>Status Codes and Error Handling:</strong></p><ul><li><strong>204 No Content: </strong>Returned when no records are found for task items or employees.</li><li><strong>200 OK:</strong> Returned when records are successfully retrieved.</li><li><strong>201 Created: </strong>Returned when a new task item or employee is successfully created.</li><li><strong>400 Bad Request: </strong>Returned for validation errors, such as insufficient name length or mismatched IDs during updates.</li><li><strong>404 Not Found:</strong> Returned when a task item or employee is not found during retrieval or deletion.</li><li><strong>EmployeeException: </strong>Thrown when the <strong>Name </strong>in an<strong> </strong>employee is less than 3 characters long, with the message: \"<strong>Employee name should be at least 3 characters long.\". </strong>This<strong> </strong>exception should return<strong> status code 500</strong>.<strong> </strong></li></ul><p><br></p><p><strong><u>Note:</u></strong></p><ul><li>Use swagger/index to view the API output screen in 8080 port.</li><li>Don't delete any files in the project environment.</li><li>When clicking on Run Testcase button make sure that your application is running on the port 8080.</li></ul><p><br></p><p><strong>Commands to Run the Project:</strong></p><ul><li><strong>cd dotnetapp</strong></li></ul><p>Select the dotnet project folder</p><ul><li><strong>dotnet restore</strong></li></ul><p>This command will restore all the required packages to run the application.</p><ul><li><strong>dotnet dotnet-ef migrations add initialsetup </strong></li></ul><p>This command is to add migrations</p><ul><li><strong>dotnet dotnet-ef database update </strong></li></ul><p>This command is to update the database.</p><ul><li><strong>dotnet run</strong></li></ul><p>To run the application in port 8080 (The settings preloaded click 8080 Port to View)</p><ul><li><strong>dotnet build</strong></li></ul><p>To build and check for errors</p><ul><li><strong>dotnet clean</strong></li></ul><p>If the same error persists clean the project and build again</p><p><br></p><p><br></p><p><strong>For Entity Framework Core:</strong></p><p>To use</p><p>Entity Framework :</p><p>Install EF:</p><p><strong>dotnet new tool-manifest</strong></p><p><strong>dotnet tool install --local dotnet-ef --version 6.0.6</strong></p><p>--Then use dotnet dotnet-ef instead of dotnet-ef.</p><p><strong>&nbsp;dotnet dotnet-ef</strong></p><p>--To check the EF installed or not</p><p><strong>dotnet dotnet-ef migrations add \"InitialSetup\"</strong></p><p>--command to setup initial creating of tables mentioned iin DBContext</p><p><strong>dotnet dotnet-ef database update</strong></p><p>--command to update the database</p><p><strong>Note:</strong></p><p>Use the below sample connection string to connect the MsSql Server</p><p>&nbsp;private string <strong>connectionString </strong>= \"User ID=sa;password=examlyMssql@123; server=localhost<strong>;</strong>Database=appdb;trusted_connection=false;Persist Security Info=False;Encrypt=False\";</p>",
    //         "codeComponents": [
    //             {
    //                 "type": "directory",
    //                 "name": "dotnetapp",
    //                 "contents": [
    //                     {
    //                         "type": "directory",
    //                         "name": "Controllers",
    //                         "contents": [
    //                             {
    //                                 "type": "file",
    //                                 "name": "EmployeeController.cs",
    //                                 "code": "using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Threading.Tasks;\nusing Microsoft.AspNetCore.Mvc;\nusing Microsoft.EntityFrameworkCore;\nusing dotnetapp.Models;\nusing dotnetapp.Data;\nusing dotnetapp.Exceptions;\nusing System.Runtime.ExceptionServices;\n\nnamespace dotnetapp.Controllers\n{\n    [ApiController]\n    [Route(\"api/[controller]\")]\n    public class EmployeeController : ControllerBase\n    {\n        public ApplicationDbContext db;\n        public EmployeeController(ApplicationDbContext db1)\n        {\n            db=db1;\n        }\n        //check later in manual checking\n        [HttpPost]\n        public async Task&lt;ActionResult&gt; CreateEmployee([FromBody] Employee employee)\n        {\n          \n          try\n          {\n            if(employee.Name.Length&lt;=3)\n            {\n                throw new EmployeeException(\"Employee name should be at least 3 characters long.\");\n            }\n            db.Employees.Add(employee);\n            db.SaveChanges();\n            return CreatedAtAction(nameof(CreateEmployee), new{id= employee.EmployeeId}, employee);\n          }\n          catch(EmployeeException ex)\n          {\n            return StatusCode(500, ex.Message);\n          }\n            \n\n        }\n        [HttpGet(\"Search{employeeName}\")]\n         public async Task&lt;ActionResult&gt; SearchEmployeeByName(string name)\n         {\n            var emp = db.Employees.FirstOrDefault(e=&gt;e.Name==name);\n            // if(!emp.Name.IsValid)\n            // {\n            //     return BadRequest();\n            // }\n            if(emp == null)\n            {\n                return NotFound();\n            }\n            return Ok(emp);\n         }\n\n    }\n}"
    //                             },
    //                             {
    //                                 "type": "file",
    //                                 "name": "TaskItemController.cs",
    //                                 "code": "using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Threading.Tasks;\nusing dotnetapp.Data;\nusing Microsoft.AspNetCore.Mvc;\nusing Microsoft.EntityFrameworkCore;\nusing dotnetapp.Models;\nusing dotnetapp.Data;\nusing dotnetapp.Exceptions;\n\nnamespace dotnetapp.Controllers\n{\n    [ApiController]\n    [Route(\"api/[controller]\")]\n    public class TaskItemController : ControllerBase\n    {\n        public ApplicationDbContext db;\n        public TaskItemController(ApplicationDbContext db1)\n        {\n            db=db1;\n        }\n        //checklater in manual checking\n        [HttpGet]\n        public async Task&lt;ActionResult&gt; GetTaskItems()\n        {\n            var ti = db.TaskItems.Include(e=&gt;e.Employee).ToList();\n            if(ti==null)\n            {\n                return NoContent();\n            }\n            return Ok(ti);\n        }\n        //checklater in manual checking\n        [HttpGet(\"{id}\")]\n         public async Task&lt;ActionResult&gt; GetTaskItem(int id)\n         {\n             var ti = db.TaskItems.Include(e=&gt;e.Employee).FirstOrDefault(t=&gt;t.TaskItemId==id);\n            if(ti==null)\n            {\n                return NotFound();\n            }\n            return Ok(ti);\n         }\n         [HttpPost]\n          public async Task&lt;ActionResult&gt; CreateTaskItem([FromBody] TaskItem taskItem)\n          {\n            if(taskItem.EmployeeId==null)\n            {\n                return BadRequest();\n            }\n            db.TaskItems.Add(taskItem);\n            db.SaveChanges();\n            return CreatedAtAction(nameof(CreateTaskItem), new {id=taskItem.TaskItemId}, taskItem);\n          }\n          [HttpDelete(\"{id}\")]\n          public async Task&lt;ActionResult&gt; DeleteTaskItem(int id)\n          {\n            var task = db.TaskItems.FirstOrDefault(i=&gt;i.TaskItemId==id);\n            if(task == null)\n            {\n                return NotFound();\n            }\n            db.TaskItems.Remove(task);\n            db.SaveChanges();\n            return NoContent();\n\n          }\n         \n\n\n        \n    }\n}"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "directory",
    //                         "name": "Data",
    //                         "contents": [
    //                             {
    //                                 "type": "file",
    //                                 "name": "ApplicationDbContext.cs",
    //                                 "code": "using dotnetapp.Models;\nusing Microsoft.EntityFrameworkCore;\n\nnamespace dotnetapp.Data\n{\n    public class ApplicationDbContext : DbContext\n    {\n        public ApplicationDbContext(DbContextOptions&lt;ApplicationDbContext&gt; options)\n            : base(options)\n        {\n        }\n\n        // Represent the Employees table\n         // Represent the TaskItems table\n        public DbSet&lt;Employee&gt; Employees {get;set;}\n        public DbSet&lt;TaskItem&gt; TaskItems {get;set;}\n\n        protected override void OnModelCreating(ModelBuilder modelBuilder)\n        {\n            // Configuring the one-to-many relationship between Employee and TaskItem\n            modelBuilder.Entity&lt;Employee&gt;()\n            .HasMany(a=&gt;a.TaskItems)\n            .WithOne(b=&gt;b.Employee)\n            .HasForeignKey(c=&gt;c.EmployeeId)\n            .OnDelete(DeleteBehavior.Cascade);\n        }\n    }\n}\n"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "directory",
    //                         "name": "Exceptions",
    //                         "contents": [
    //                             {
    //                                 "type": "file",
    //                                 "name": "EmployeeException.cs",
    //                                 "code": "\nusing System;\nusing System.Runtime.Serialization;\n\nnamespace dotnetapp.Exceptions\n{\n    public class EmployeeException : Exception\n    {\n        public EmployeeException(){}\n        public EmployeeException(string message) : base(message)\n        {}\n    }\n}"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "directory",
    //                         "name": "Models",
    //                         "contents": [
    //                             {
    //                                 "type": "file",
    //                                 "name": "Employee.cs",
    //                                 "code": "using System.Collections;\nusing System.Text.Json.Serialization;\nusing System.ComponentModel.DataAnnotations;\n\nnamespace dotnetapp.Models\n{\n    public class Employee\n    {\n        public int EmployeeId {get;set;}\n        public string Name {get;set;}\n        public string Email {get;set;}\n        public string PhoneNumber {get;set;}\n        public string Department {get;set;}\n        \n        [JsonIgnore]\n        public ICollection&lt;TaskItem&gt;? TaskItems {get;set;}\n\n    }\n}\n"
    //                             },
    //                             {
    //                                 "type": "file",
    //                                 "name": "TaskItem.cs",
    //                                 "code": "using System.Text.Json.Serialization;\nusing System.ComponentModel.DataAnnotations;\n\nnamespace dotnetapp.Models\n{\n    public class TaskItem\n    {\n        public int TaskItemId {get;set;}\n        public string Title {get;set;}\n        public string  Description {get;set;}\n        public string DueDate {get;set;}\n        public string Priority {get;set;}\n        public int? EmployeeId {get;set;}\n\n        \n        public Employee? Employee {get;set;}\n    }\n}\n"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "file",
    //                         "name": "Program.cs",
    //                         "code": "using System.Reflection.Emit;\nusing dotnetapp.Data;\nusing System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Threading.Tasks;\nusing Microsoft.AspNetCore.Mvc;\nusing Microsoft.EntityFrameworkCore;\nusing dotnetapp.Models;\nusing dotnetapp.Exceptions;\n\nvar builder = WebApplication.CreateBuilder(args);\n\n// Add services to the container.\n\nbuilder.Services.AddControllers();\n// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle\nbuilder.Services.AddEndpointsApiExplorer();\nbuilder.Services.AddSwaggerGen();\nbuilder.Services.AddDbContext&lt;ApplicationDbContext&gt;(op=&gt;op.UseSqlServer(builder.Configuration.GetConnectionString(\"conn\")));\n\nvar app = builder.Build();\n\n// Configure the HTTP request pipeline.\nif (app.Environment.IsDevelopment())\n{\n    app.UseSwagger();\n    app.UseSwaggerUI();\n}\n\napp.UseHttpsRedirection();\n\napp.UseAuthorization();\n\napp.MapControllers();\n\napp.Run();\n"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "type": "directory",
    //                 "name": "TestProject",
    //                 "contents": []
    //             }
    //         ],
    //         "aiAnalysis": "The provided solution is missing the connection string in the `Program.cs` file, which is expected to be \"User ID=sa;password=examlyMssql@123; server=localhost;Database=appdb;trusted_connection=false;Persist Security Info=False;Encrypt=False\" as mentioned in the description. The `SearchEmployeeByName` method in `EmployeeController.cs` is not correctly implemented as it should return employees whose names start with the given prefix, but instead it returns a single employee with the exact name. The logs also indicate that the `CreateEmployee` method is not throwing the `EmployeeException` as expected when the employee's name is less than 3 characters long. \n\nFinal analysis: The solution has errors in the connection string, employee search functionality, and exception handling for employee creation. The code needs to be corrected to match the expected functionality as described in the problem statement. Overall, the solution is not fully implemented and has several issues that need to be addressed to pass the tests.",
    //         "Test_Submitted_Time": "2025-01-17 | 04:48:33 PM",
    //         "SonarAddedTime": "2025-01-17 | 04:47:34 PM",
    //         "Differnce_In_Submission": "0.98 mins",
    //         "log": [
    //             "{\n  \"passed\": [\n    \"CreateEmployee_ReturnsCreatedEmployee\",\n    \"CreateTaskItem_ReturnsCreatedTaskWithEmployeeDetails\",\n    \"DeleteTaskItem_InvalidId_ReturnsNotFound\",\n    \"DeleteTaskItem_ReturnsNoContent\",\n    \"EmployeeModel_HasAllProperties\",\n    \"EmployeeTask_Relationship_IsConfiguredCorrectly\",\n    \"GetTaskItemById_InvalidId_ReturnsNotFound\",\n    \"TaskItemModel_HasAllProperties\",\n    \"CreateEmployee_ReturnsCreatedEmployee\",\n    \"CreateTaskItem_ReturnsCreatedTaskWithEmployeeDetails\",\n    \"DbContext_HasDbSetProperties\",\n    \"DeleteTaskItem_InvalidId_ReturnsNotFound\",\n    \"DeleteTaskItem_ReturnsNoContent\",\n    \"EmployeeModel_HasAllProperties\",\n    \"EmployeeTask_Relationship_IsConfiguredCorrectly\",\n    \"GetTaskItemById_InvalidId_ReturnsNotFound\",\n    \"TaskItemModel_HasAllProperties\"\n  ],\n  \"failed\": [\n    {\n      \"testName\": \"CreateEmployee_ThrowsEmployeeException_ForInvalidShortName\",\n      \"errorMessage\": \"Expected: InternalServerError\\r\\n  But was:  Created\"\n    },\n    {\n      \"testName\": \"CreateEmployee_ThrowsEmployeeException_ForShortName\",\n      \"errorMessage\": \"Expected: InternalServerError\\r\\n  But was:  Created\"\n    },\n    {\n      \"testName\": \"GetTaskById_ReturnsTaskWithEmployeeDetails\",\n      \"errorMessage\": \"Expected: not null\\r\\n  But was:  null\"\n    },\n    {\n      \"testName\": \"GetTaskItems_ReturnsListOfTaskItemsWithEmployees\",\n      \"errorMessage\": \"Expected: not null\\r\\n  But was:  null\"\n    },\n    {\n      \"testName\": \"SearchEmployeeByName_ReturnsEmployeeWithTaskItems\",\n      \"errorMessage\": \"Expected: OK\\r\\n  But was:  NotFound\"\n    }\n  ]\n}"
    //         ],
    //         "TestCode": {
    //             "UnitTest1.cs": "using NUnit.Framework;\nusing System.Net;\nusing System.Text;\nusing System.Threading.Tasks;\nusing Microsoft.EntityFrameworkCore;\nusing dotnetapp.Data;\nusing dotnetapp.Models;\nusing System;\nusing System.Net.Http;\nusing System.Text.Json.Serialization;\nusing Newtonsoft.Json;\nusing System.Collections.Generic;\nusing System.Linq;\n\nnamespace dotnetapp.Tests\n{\n    [TestFixture]\n    public class EmployeeTaskControllerTests\n    {\n        private DbContextOptions&lt;ApplicationDbContext&gt; _dbContextOptions;\n        private ApplicationDbContext _context;\n        private HttpClient _httpClient;\n\n        [SetUp]\n        public void Setup()\n        {\n            _httpClient = new HttpClient();\n            _httpClient.BaseAddress = new Uri(\"http://localhost:8080\");\n            _dbContextOptions = new DbContextOptionsBuilder&lt;ApplicationDbContext&gt;()\n                .UseInMemoryDatabase(databaseName: \"TestDatabase\")\n                .Options;\n\n            _context = new ApplicationDbContext(_dbContextOptions);\n\n            var newEmployee = new Employee\n            {\n                Name = \"Test Employee\",\n                Email = \"test@example.com\",\n                PhoneNumber = \"123-456-7890\",\n                Department = \"IT\"\n            };\n\n            _context.Employees.Add(newEmployee);\n            _context.SaveChangesAsync();\n        }\n\n        private async Task&lt;int&gt; CreateTestEmployeeAndGetId()\n        {\n            var newEmployee = new Employee\n            {\n                Name = \"Test Employee\",\n                Email = \"test@example.com\",\n                PhoneNumber = \"123-456-7890\",\n                Department = \"IT\"\n            };\n\n            var json = JsonConvert.SerializeObject(newEmployee);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            var response = await _httpClient.PostAsync(\"api/Employee\", content);\n            response.EnsureSuccessStatusCode();\n\n            var createdEmployee = JsonConvert.DeserializeObject&lt;Employee&gt;(await response.Content.ReadAsStringAsync());\n            return createdEmployee.EmployeeId;\n        }\n\n        [Test]\n        public async Task CreateEmployee_ReturnsCreatedEmployee()\n        {\n            var newEmployee = new Employee\n            {\n                Name = \"Test Employee\",\n                Email = \"test@example.com\",\n                PhoneNumber = \"123-456-7890\",\n                Department = \"IT\"\n            };\n\n            var json = JsonConvert.SerializeObject(newEmployee);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            var response = await _httpClient.PostAsync(\"api/Employee\", content);\n\n            Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            var createdEmployee = JsonConvert.DeserializeObject&lt;Employee&gt;(responseContent);\n            Assert.IsNotNull(createdEmployee);\n            Assert.AreEqual(newEmployee.Name, createdEmployee.Name);\n            Assert.AreEqual(newEmployee.Email, createdEmployee.Email);\n            Assert.AreEqual(newEmployee.PhoneNumber, createdEmployee.PhoneNumber);\n            Assert.AreEqual(newEmployee.Department, createdEmployee.Department);\n        }\n\n        [Test]\n        public async Task SearchEmployeeByName_ReturnsEmployeeWithTaskItems()\n        {\n            await CreateTestEmployeeAndGetId();\n            string employeeName = \"Test Employee\";\n\n            var response = await _httpClient.GetAsync($\"api/Employee/Search?name={employeeName}\");\n            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);\n            var responseContent = await response.Content.ReadAsStringAsync();\n            var employee = JsonConvert.DeserializeObject&lt;Employee[]&gt;(responseContent);\n            Assert.IsNotNull(employee);\n            Assert.IsTrue(employee.Length &gt; 0);\n            Assert.AreEqual(employeeName, employee[0].Name);\n        }\n\n        [Test]\n        public async Task CreateTaskItem_ReturnsCreatedTaskWithEmployeeDetails()\n        {\n            int employeeId = await CreateTestEmployeeAndGetId();\n\n            var newTask = new Models.TaskItem\n            {\n                Title = \"Test Task\",\n                Description = \"Test Description\",\n                DueDate = \"2024-03-20\",\n                Priority = \"High\",\n                EmployeeId = employeeId\n            };\n\n            var json = JsonConvert.SerializeObject(newTask);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            var response = await _httpClient.PostAsync(\"api/TaskItem\", content);\n\n            Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            var createdTask = JsonConvert.DeserializeObject&lt;Models.TaskItem&gt;(responseContent);\n\n            Assert.IsNotNull(createdTask);\n            Assert.AreEqual(newTask.Title, createdTask.Title);\n            Assert.AreEqual(newTask.Description, createdTask.Description);\n\n        }\n\n        [Test]\n        public async Task GetTaskItems_ReturnsListOfTaskItemsWithEmployees()\n        {\n            var response = await _httpClient.GetAsync(\"api/TaskItem\");\n\n            response.EnsureSuccessStatusCode();\n            var responseContent = await response.Content.ReadAsStringAsync();\n            var tasks = JsonConvert.DeserializeObject&lt;Models.TaskItem[]&gt;(responseContent);\n\n            Assert.IsNotNull(tasks);\n            if (tasks.Length &gt; 0)\n            {\n                Assert.IsNotNull(tasks[0].Employee);\n            }\n        }\n\n        [Test]\n        public async Task GetTaskById_ReturnsTaskWithEmployeeDetails()\n        {\n            int employeeId = await CreateTestEmployeeAndGetId();\n            var newTask = new Models.TaskItem\n            {\n                Title = \"Test Task\",\n                Description = \"Test Description\",\n                DueDate = \"2024-03-20\",\n                Priority = \"High\",\n                EmployeeId = employeeId\n            };\n\n            var json = JsonConvert.SerializeObject(newTask);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            var response = await _httpClient.PostAsync(\"api/TaskItem\", content);\n            var createdTask = JsonConvert.DeserializeObject&lt;Models.TaskItem&gt;(await response.Content.ReadAsStringAsync());\n\n            var getResponse = await _httpClient.GetAsync($\"api/TaskItem/{createdTask.TaskItemId}\");\n\n            getResponse.EnsureSuccessStatusCode();\n            var task = JsonConvert.DeserializeObject&lt;Models.TaskItem&gt;(await getResponse.Content.ReadAsStringAsync());\n            Assert.IsNotNull(task);\n            Assert.AreEqual(newTask.Title, task.Title);\n            Assert.IsNotNull(task.Employee);\n        }\n\n        [Test]\n        public async Task GetTaskItemById_InvalidId_ReturnsNotFound()\n        {\n            var response = await _httpClient.GetAsync(\"api/TaskItem/999\");\n            Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);\n        }\n\n        [Test]\n        public async Task DeleteTaskItem_ReturnsNoContent()\n        {\n            int employeeId = await CreateTestEmployeeAndGetId();\n            var newTask = new Models.TaskItem\n            {\n                Title = \"Test Task\",\n                Description = \"Test Description\",\n                DueDate = \"2024-03-20\",\n                Priority = \"High\",\n                EmployeeId = employeeId\n            };\n\n            var json = JsonConvert.SerializeObject(newTask);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            var response = await _httpClient.PostAsync(\"api/TaskItem\", content);\n            var createdTask = JsonConvert.DeserializeObject&lt;Models.TaskItem&gt;(await response.Content.ReadAsStringAsync());\n\n            var deleteResponse = await _httpClient.DeleteAsync($\"api/TaskItem/{createdTask.TaskItemId}\");\n\n            Assert.AreEqual(HttpStatusCode.NoContent, deleteResponse.StatusCode);\n\n            var getResponse = await _httpClient.GetAsync($\"api/TaskItem/{createdTask.TaskItemId}\");\n            Assert.AreEqual(HttpStatusCode.NotFound, getResponse.StatusCode);\n        }\n\n        [Test]\n        public async Task DeleteTaskItem_InvalidId_ReturnsNotFound()\n        {\n            var response = await _httpClient.DeleteAsync(\"api/TaskItem/999\");\n            Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);\n        }\n\n        [Test]\n        public void EmployeeModel_HasAllProperties()\n        {\n            var employee = new Employee\n            {\n                EmployeeId = 1,\n                Name = \"John Doe\",\n                Email = \"john@example.com\",\n                PhoneNumber = \"123-456-7890\",\n                Department = \"IT\",\n                TaskItems = new List&lt;Models.TaskItem&gt;()\n            };\n\n            Assert.AreEqual(1, employee.EmployeeId);\n            Assert.AreEqual(\"John Doe\", employee.Name);\n            Assert.AreEqual(\"john@example.com\", employee.Email);\n            Assert.AreEqual(\"123-456-7890\", employee.PhoneNumber);\n            Assert.AreEqual(\"IT\", employee.Department);\n            Assert.IsNotNull(employee.TaskItems);\n            Assert.IsInstanceOf&lt;ICollection&lt;Models.TaskItem&gt;&gt;(employee.TaskItems);\n        }\n\n        [Test]\n        public void TaskItemModel_HasAllProperties()\n        {\n            var employee = new Employee\n            {\n                EmployeeId = 1,\n                Name = \"John Doe\",\n                Email = \"john@example.com\",\n                PhoneNumber = \"123-456-7890\",\n                Department = \"IT\"\n            };\n\n            var task = new Models.TaskItem\n            {\n                TaskItemId = 1,\n                Title = \"Test Task\",\n                Description = \"Test Description\",\n                DueDate = \"2024-03-20\",\n                Priority = \"High\",\n                EmployeeId = 1,\n                Employee = employee\n            };\n\n            Assert.AreEqual(1, task.TaskItemId);\n            Assert.AreEqual(\"Test Task\", task.Title);\n            Assert.AreEqual(\"Test Description\", task.Description);\n            Assert.AreEqual(\"2024-03-20\", task.DueDate);\n            Assert.AreEqual(\"High\", task.Priority);\n            Assert.AreEqual(1, task.EmployeeId);\n            Assert.IsNotNull(task.Employee);\n        }\n\n        [Test]\n        public void DbContext_HasDbSetProperties()\n        {\n            Assert.IsNotNull(_context.Employees, \"Employees DbSet is not initialized.\");\n            Assert.IsNotNull(_context.TaskItems, \"TaskItems DbSet is not initialized.\");\n        }\n\n        [Test]\n        public void EmployeeTask_Relationship_IsConfiguredCorrectly()\n        {\n            var model = _context.Model;\n            var employeeEntity = model.FindEntityType(typeof(Employee));\n            var taskEntity = model.FindEntityType(typeof(Models.TaskItem));\n\n            var foreignKey = taskEntity.GetForeignKeys().FirstOrDefault(fk =&gt; fk.PrincipalEntityType == employeeEntity);\n\n            Assert.IsNotNull(foreignKey, \"Foreign key relationship between Task and Employee is not configured.\");\n            Assert.AreEqual(\"EmployeeId\", foreignKey.Properties.First().Name, \"Foreign key property name is incorrect.\");\n\n            // Check if the cascade delete behavior is set\n            Assert.AreEqual(DeleteBehavior.Cascade, foreignKey.DeleteBehavior, \"Cascade delete behavior is not set correctly.\");\n        }\n\n\n        [Test]\n        public async Task CreateEmployee_ThrowsEmployeeException_ForShortName()\n        {\n            // Arrange\n            var newEmployee = new Employee\n            {\n                Name = \"Jo\",  // Short name\n                Email = \"shortname@example.com\",\n                PhoneNumber = \"987-654-3210\",\n                Department = \"EEE\"\n            };\n\n            var json = JsonConvert.SerializeObject(newEmployee);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Employee\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.InternalServerError, response.StatusCode); // 500 for thrown exception\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            Assert.IsTrue(responseContent.Contains(\"Employee name should be at least 3 characters long.\"), \"Expected error message not found in the response.\");\n        }\n\n        [Test]\n        public async Task CreateEmployee_ThrowsEmployeeException_ForInvalidShortName()\n        {\n            // Arrange\n            var newEmployee = new Employee\n            {\n                Name = \"Jo\",  // Short name\n                Email = \"shortname@example.com\",\n                PhoneNumber = \"987-654-3210\",\n                Department = \"CSE\"\n            };\n\n            var json = JsonConvert.SerializeObject(newEmployee);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Employee\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.InternalServerError, response.StatusCode); // 500 for thrown exception\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            Assert.IsTrue(responseContent.Contains(\"Employee name should be at least 3 characters long.\"), \"Expected error message not found in the response.\");\n        }\n\n        [TearDown]\n        public void Cleanup()\n        {\n            _httpClient.Dispose();\n        }\n    }\n}"
    //         }
    //     },
    //     {
    //         "key": "bcbedfedadaaefc322386220cfdbaddbcaeone",
    //         "test_Id": "",
    //         "name": "Hritik  Raj",
    //         "tcList": [
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CreateProperty_ReturnsCreatedProperty",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CreateTenant_ReturnsCreatedTenant",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "GetPropertiesSortedByPriceDesc_ReturnsSortedProperties",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "GetPropertyById_ReturnsProperty",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "UpdateTenant_ReturnsNoContent",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "UpdateTenant_InvalidId_ReturnsNotFound",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "GetTenants_ReturnsListOfTenantsWithProperties",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "GetPropertyById_InvalidId_ReturnsNotFound",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "PropertyModel_HasAllProperties",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "TenantModel_HasAllProperties",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "DbContext_HasDbSetProperties",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "PropertyTenant_Relationship_IsConfiguredCorrectly",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CreateProperty_ThrowsAddressException_ForInvalidAddress",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CreateProperty_ThrowsAddressException_ForOtherAddress",
    //                 "result": "Failure"
    //             }
    //         ],
    //         "QuestionData": "<p><strong>Develop a WEB API Project for Property Rental Management system</strong></p><p><br></p><p><strong>Problem Statement:</strong></p><p>Develop a WEB API project for a Property Rental Management system using ASP.NET Core. The API will provide services for managing properties and tenants. Your task is to design and implement the API based on the given requirements, focusing on action methods, controllers, endpoints, and appropriate status codes.</p><p><br></p><p><strong>Models:</strong></p><ul><li>Create a folder named Models. </li><li>You will define two models: <strong>Tenant</strong> and <strong>Property</strong>.<strong> </strong>These models represent the structure of the data you’ll be working with.  For example:</li></ul><p><br></p><p><strong>1.Tenant</strong></p><p><strong>Properties:</strong></p><ul><li><strong>TenantId</strong> <strong>(int)</strong>: Unique identifier for the tenant.</li><li><strong>Name (string): </strong>Name of the tenant.</li><li><strong>Email (string): </strong>Email address of the tenant.</li><li><strong>PropertyId (int?):</strong> Foreign key linking to the associated Property.</li><li><strong>Property (Property?): </strong>Navigation property to the associated Property.</li></ul><p><br></p><p><strong>2.Property:</strong></p><p><strong>Properties:</strong></p><ul><li><strong>PropertyId (int): </strong>Unique identifier for the property.</li><li><strong>Address (string): </strong>Address of the property.</li><li><strong>RentalPrice (decimal): </strong>Monthly rental price for the property.</li><li><strong>AvailableFrom (string): </strong>Date when the property becomes available for rent.</li><li><strong>Tenants (ICollection&lt;Tenant&gt;?): </strong>Collection of tenants associated with the property. <span style=\"color: rgb(51, 51, 51);\">The</span><strong style=\"color: rgb(51, 51, 51);\"> [JsonIgnore]</strong><span style=\"color: rgb(51, 51, 51);\"> attribute is applied to this property, indicating that it should be excluded from JSON serialization.</span></li></ul><p><br></p><p>Using <strong>ApplicationDbContext</strong> for Tentant and Property Management. ApplicationDbContext must be present inside the folder Data. </p><p><strong>\tNamespace - dotnetapp.Data</strong></p><p><br></p><p>The <strong>ApplicationDbContext</strong> class acts as the primary interface between the application and the database, managing CRUD (Create, Read, Update, Delete) operations for <strong>Property</strong> entities and (Create, Read, Update, Delete) operations for <strong>Tenant</strong> entities. This context class defines the database schema through its DbSet properties and manages the <strong>one-to-many relationship </strong>between Property and Tenant.</p><p><br></p><p><strong>DbSet Properties:</strong></p><p><br></p><p><strong>DbSet&lt;Property&gt; Properties:</strong> </p><p>Represents a collection of Property entities stored in the Properties table. Each Property can have multiple associated Tenant entries, defining the <strong>one-to-many relationship </strong>between Property and Tenant (i.e., one property can be rented by many tenants over time).</p><p><br></p><p><strong>DbSet&lt;Tenant&gt; Tenants: </strong></p><p>Represents a collection of Tenant entities stored in the Tenants table. Each Tenant is associated with a single Property, establishing a <strong>many-to-one relationship</strong> with the Tenant entity.</p><p><br></p><p><strong>Configuration:</strong></p><p><strong>One-to-Many Relationship: </strong>Configures the relationship where one Property can have many Tenants.</p><p><br></p><p><strong>Implement the actual logic in the controller:</strong></p><p><br></p><p><strong>Controllers: Namespace: dotnetapp.Controllers</strong></p><p><br></p><p><strong>TenantController</strong></p><p><br></p><ul><li><strong>GetTenants() -</strong> Retrieves a list of all tenants along with their associated properties. If no tenants are found, it returns a <strong>204 No Content</strong>. Otherwise, it returns a <strong>200 OK</strong> with a list of tenants and their related property details.</li><li><strong>CreateTenant([FromBody] Tenant tenant) -</strong> Adds a new tenant to the database. If the <strong>PropertyId</strong> is not provided, it returns a <strong>400 Bad Request</strong> with an error message. Upon successful creation, it returns a <strong>201 Created</strong> with the location of the newly created tenant.</li><li><strong>UpdateTenant(int id, [FromBody] Tenant tenant) - </strong>Updates an existing tenant identified by<strong> id</strong>. If the provided id does not match the TenantId in the request body or if the tenant does not exist, <strong>404 Not Found, </strong>respectively. On successful update, it returns <strong>204 No Content.</strong></li></ul><p><br></p><p><strong>PropertyController</strong></p><p><br></p><ul><li><strong>GetProperty(int id)</strong> - Retrieves a single property by their <strong>PropertyId</strong> along with their associated tenants. If the property is not found, it returns a<strong> 404 Not Found.</strong> If found, it returns a<strong> 200 OK</strong> with the property details and their related tenants.</li><li><strong>CreateProperty([FromBody] Property </strong>propertyModel<strong>) -</strong> Adds a new propertyModel to the database. Upon successful creation, it returns a<strong> 201 Created </strong>with the address of the newly created propertyModel. A <strong>PropertyAddressException</strong> is thrown for invalid addresses with<strong> 500 status code</strong>.</li><li><strong>GetPropertiesSortedByPriceDesc()</strong> - Retrieves all properties sorted by rental price in descending order. <strong>200 OK</strong> is returned with a sorted list of properties and their tenants.</li></ul><p><br></p><p><strong>PropertyAddressException:</strong></p><p><br></p><p><strong>Namespace: dotnetapp.Exceptions</strong></p><p><strong>Description:</strong> A custom exception thrown when a property’s address is not among the allowed address. This exception is used to enforce address constraints for properties, ensuring that only specific, predefined address are accepted.</p><p><br></p><p><strong>Allowed Address:</strong></p><p>The property’s address must be one of the following:</p><ul><li><strong>\"New York\"</strong></li><li><strong>\"San Francisco\"</strong></li></ul><p><strong>Error Message Format:</strong></p><ul><li>When the exception is thrown, the error message follows the format: </li><li class=\"ql-indent-1\"><strong>\"Address '{propertyModel.Address}' is not allowed. Only allowed address are: {string.Join(\", \", AllowedAddress)}.\"</strong></li><li>This message provides a specific indication of the invalid address and lists the allowed address.</li></ul><p><br></p><p><strong>Endpoints:</strong></p><p><br></p><p><strong>Tenants:</strong></p><p><br></p><ul><li><strong>GET /api/Tenant </strong>- Retrieve a list of all tenants, including their associated properties.</li><li><strong>POST /api/Tenant</strong> - Create a new tenant. Requires a <strong>PropertyId</strong>.</li><li><strong>PUT /api/Tenant/{id}</strong> - Update an existing tenant by its <strong>ID</strong>.</li></ul><p><br></p><p><strong>Properties:</strong></p><ul><li><strong>GET /api/Property/{id} </strong>- Retrieve a specific property by their ID, including their associated tenants.</li><li><strong>POST /api/Property</strong> - Create a new property.</li><li><strong style=\"color: rgb(51, 51, 51);\">GET /api/Property/SortedByPriceDesc - </strong>Retrieves all properties sorted by rental price in descending order. </li></ul><p><br></p><p><strong>Status Codes and Error Handling:</strong></p><p><strong>204 No Content:</strong> Returned when no records are found for tenants or properties.</p><p><strong>200 OK:</strong> Returned when records are successfully retrieved.</p><p><strong>201 Created:</strong> Returned when a new tenant or property is successfully created.</p><p><strong>400 Bad Request: </strong>Returned when there are validation errors or mismatched IDs during updates.</p><p><strong>404 Not Found:</strong> Returned when a tenant or property is not found during retrieval or deletion.</p><p><strong style=\"color: rgb(51, 51, 51);\">PropertyAddressException: </strong><span style=\"color: rgb(51, 51, 51);\">Thrown when the </span><strong style=\"color: rgb(51, 51, 51);\">Address </strong><span style=\"color: rgb(51, 51, 51);\">in a property is invalid address, with the message: \"</span><strong style=\"color: rgb(51, 51, 51);\">Address '{propertyModel.Address}' is not allowed. Only allowed address are: {string.Join(\", \", AllowedAddress)}.\". </strong><span style=\"color: rgb(51, 51, 51);\">This</span><strong style=\"color: rgb(51, 51, 51);\"> </strong><span style=\"color: rgb(51, 51, 51);\">exception should return</span><strong style=\"color: rgb(51, 51, 51);\"> status code 500</strong><span style=\"color: rgb(51, 51, 51);\">.</span><strong style=\"color: rgb(51, 51, 51);\"> </strong></p><p><br></p><p><strong><u>Note:</u></strong></p><ul><li>Use swagger/index to view the API output screen in 8080 port.</li><li>Don't delete any files in the project environment.</li><li>When clicking on Run Testcase button make sure that your application is running on the port 8080.</li></ul><p><br></p><p><strong>Commands to Run the Project:</strong></p><ul><li><strong>cd dotnetapp</strong></li></ul><p>Select the dotnet project folder</p><ul><li><strong>dotnet restore</strong></li></ul><p>This command will restore all the required packages to run the application.</p><ul><li><strong>dotnet dotnet-ef migrations add initialsetup</strong> </li></ul><p>This command is to add migrations</p><ul><li><strong>dotnet dotnet-ef database update </strong></li></ul><p>This command is to update the database.</p><ul><li><strong>dotnet run</strong></li></ul><p>To run the application in port 8080 (The settings preloaded click 8080 Port to View)</p><ul><li><strong>dotnet build</strong></li></ul><p>To build and check for errors</p><ul><li><strong>dotnet clean</strong></li></ul><p>If the same error persists clean the project and build again</p><p><br></p><p><br></p><p><strong>For Entity Framework Core:</strong></p><p>To use</p><p>Entity Framework :</p><p>Install EF:</p><p><strong>dotnet new tool-manifest</strong></p><p><strong>dotnet tool install --local dotnet-ef --version 6.0.6</strong></p><p>--Then use dotnet dotnet-ef instead of dotnet-ef.</p><p><strong>&nbsp;dotnet dotnet-ef</strong></p><p>--To check the EF installed or not</p><p><strong>dotnet dotnet-ef migrations add \"InitialSetup\"</strong></p><p>--command to setup initial creating of tables mentioned iin DBContext</p><p><strong>dotnet dotnet-ef database update</strong></p><p>--command to update the database</p><p><strong>Note:</strong></p><p><strong>Use the below sample connection string to connect the MsSql Server</strong></p><p><strong>&nbsp;private string connectionString </strong>= \"User ID=sa;password=examlyMssql@123; server=localhost;Database=appdb;trusted_connection=false;Persist Security Info=False;Encrypt=False\"</p>",
    //         "codeComponents": [
    //             {
    //                 "type": "directory",
    //                 "name": "dotnetapp",
    //                 "contents": [
    //                     {
    //                         "type": "directory",
    //                         "name": "Controllers",
    //                         "contents": [
    //                             {
    //                                 "type": "file",
    //                                 "name": "PropertyController.cs",
    //                                 "code": "using System;\nusing System.Collections.Generic;\nusing System.Diagnostics;\nusing System.Linq;\nusing System.Threading.Tasks;\nusing Microsoft.AspNetCore.Mvc;\nusing Microsoft.Extensions.Logging;\nusing Microsoft.EntityFrameworkCore;\nusing dotnetapp.Exceptions;\nusing dotnetapp.Models;\nusing dotnetapp.Data;\n\nnamespace dotnetapp.Controllers\n{\n    [ApiController]\n    [Route(\"api/[controller]\")]\n    public class PropertyController : ControllerBase\n    {\n        public readonly ApplicationDbContext db;\n        public PropertyController(ApplicationDbContext db1)\n        {\n            db=db1;\n        }\n        [HttpGet(\"{id}\")]\n        public async Task&lt;ActionResult&gt; GetProperty(int id)\n        {\n            var res = db.Properties.Include(e=&gt;e.Tenants).FirstOrDefault(e=&gt;e.PropertyId == id);\n            if(res == null)\n            {\n                return NotFound();\n            }\n            return Ok(res);\n        }\n        [HttpPost]\n        public async Task&lt;ActionResult&gt; CreateProperty([FromBody] Property propertyModel)\n        {\n           \n         // string[] AllowedAddress = new string[]{\"New York\",\"San Francisco\"};\n         //if(propertyModel.Address != \"New York\" || propertyModel.Address != \"San Francisco\")\n          //{\n           // throw new PropertyAddressException($\"Address '{propertyModel.Address}' is not allowed. Only allowed address are: {string.Join(\",\",AllowedAddress)}.\");\n          //}\n            db.Properties.Add(propertyModel);\n            db.SaveChanges();\n            return CreatedAtAction(nameof(CreateProperty),new{id = propertyModel.PropertyId}, propertyModel); \n        }\n        [HttpGet]\n        public async Task&lt;ActionResult&gt; GetPropertiesSortedByPriceDesc()\n        {\n            var res = db.Properties.OrderByDescending(e=&gt;e.RentalPrice).ToList();\n            return Ok(res);\n        }\n    }\n}\n"
    //                             },
    //                             {
    //                                 "type": "file",
    //                                 "name": "TenantController.cs",
    //                                 "code": "using System;\nusing System.Collections.Generic;\nusing System.Diagnostics;\nusing System.Linq;\nusing System.Threading.Tasks;\nusing Microsoft.AspNetCore.Mvc;\nusing Microsoft.Extensions.Logging;\nusing Microsoft.EntityFrameworkCore;\nusing dotnetapp.Exceptions;\nusing dotnetapp.Models;\nusing dotnetapp.Data;\n\nnamespace dotnetapp.Controllers\n{\n    [ApiController]\n    [Route(\"api/[controller]\")]\n    public class TenantController : ControllerBase\n    {\n        public readonly ApplicationDbContext db;\n        public TenantController(ApplicationDbContext db1)\n        {\n            db=db1;\n        }\n        [HttpGet]\n        public async Task&lt;ActionResult&gt; GetTenants()\n        {\n            var res = db.Tenants.Include(e=&gt;e.Property).ToList();\n            if(res==null || !res.Any())\n            {\n                return NoContent();\n            }\n            return Ok(res);\n        }\n        [HttpPost]\n        public async Task&lt;ActionResult&gt; CreateTenant([FromBody] Tenant tenant)\n        {\n            if(tenant.PropertyId == null)\n            {\n                return BadRequest();\n            }\n            db.Tenants.Add(tenant);\n            db.SaveChanges();\n            return CreatedAtAction(nameof(CreateTenant),new {id = tenant.TenantId},tenant);\n        }\n        [HttpPut(\"{id}\")]\n        public async Task&lt;ActionResult&gt; UpdateTenant(int id,[FromBody] Tenant tenant)\n        {\n            if(id != tenant.TenantId)\n            {\n                return NotFound();\n            }\n            var res = db.Tenants.FirstOrDefault(e=&gt;e.TenantId == id);\n            if(res == null)\n            {\n                return NotFound();\n            }\n            res.Name=tenant.Name;\n            res.Email=tenant.Email;\n            db.Tenants.Update(res);\n            db.SaveChanges();\n            return NoContent();\n        }\n\n    }\n}\n\n"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "directory",
    //                         "name": "Data",
    //                         "contents": [
    //                             {
    //                                 "type": "file",
    //                                 "name": "ApplicationDbContext.cs",
    //                                 "code": "using dotnetapp.Models;\nusing Microsoft.EntityFrameworkCore;\n\nnamespace dotnetapp.Data\n{\n    public class ApplicationDbContext : DbContext\n    {\n        public ApplicationDbContext(DbContextOptions&lt;ApplicationDbContext&gt; options)\n            : base(options)\n        {\n        }\n\n        // Represent the Tenants table\n        public DbSet&lt;Tenant&gt; Tenants{get;set;}\n         // Represent the Properties table\n         public DbSet&lt;Property&gt; Properties{get;set;}\n\n        protected override void OnModelCreating(ModelBuilder modelBuilder)\n        {\n            // Configuring the one-to-many relationship between Tenant and Property\n            modelBuilder.Entity&lt;Property&gt;()\n            .HasMany(e=&gt;e.Tenants)\n            .WithOne(e=&gt;e.Property)\n            .HasForeignKey(e=&gt;e.PropertyId)\n            .OnDelete(DeleteBehavior.Cascade);\n            \n                    }\n    }\n}\n"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "directory",
    //                         "name": "Exceptions",
    //                         "contents": [
    //                             {
    //                                 "type": "file",
    //                                 "name": "PropertyAddressException.cs",
    //                                 "code": "using dotnetapp.Exceptions;\nusing dotnetapp.Data;\nusing dotnetapp.Models;\nusing Microsoft.EntityFrameworkCore;\n\nnamespace dotnetapp.Exceptions\n{\n   public class PropertyAddressException : Exception\n   {\n      public PropertyAddressException(string message) : base(message)\n      {}\n   }\n}"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "directory",
    //                         "name": "Models",
    //                         "contents": [
    //                             {
    //                                 "type": "file",
    //                                 "name": "Property.cs",
    //                                 "code": "using System.Text.Json.Serialization;\nusing dotnetapp.Models;\n\nnamespace dotnetapp.Models\n{\npublic class Property \n{\n     public int PropertyId{get;set;}\n     public string Address{get;set;}\n     public decimal RentalPrice{get;set;}\n     public string AvailableFrom{get;set;}\n     \n     public ICollection&lt;Tenant&gt;? Tenants{get;set;}\n}\n}\n"
    //                             },
    //                             {
    //                                 "type": "file",
    //                                 "name": "Tenant.cs",
    //                                 "code": "using System.Text.Json.Serialization;\nusing dotnetapp.Models;\nusing System.ComponentModel.DataAnnotations;\n\nnamespace dotnetapp.Models\n{\n    public class Tenant \n{\n    public int TenantId {get;set;}\n    public string Name {get;set;}\n    public string Email{get;set;}\n    public int? PropertyId{get;set;}\n    [JsonIgnore]\n    public Property? Property{get;set;}\n}\n}\n"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "file",
    //                         "name": "Program.cs",
    //                         "code": "using dotnetapp.Models;\nusing dotnetapp.Data;\nusing Microsoft.EntityFrameworkCore;\n\nvar builder = WebApplication.CreateBuilder(args);\n\n// Add services to the container.\n\nbuilder.Services.AddControllers();\n// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle\nbuilder.Services.AddEndpointsApiExplorer();\nbuilder.Services.AddSwaggerGen();\nbuilder.Services.AddDbContext&lt;ApplicationDbContext&gt;(opt=&gt;opt.UseSqlServer(builder.Configuration.GetConnectionString(\"conn\")));\n\nvar app = builder.Build();\n\n// Configure the HTTP request pipeline.\nif (app.Environment.IsDevelopment())\n{\n    app.UseSwagger();\n    app.UseSwaggerUI();\n}\n\napp.UseHttpsRedirection();\n\napp.UseAuthorization();\n\napp.MapControllers();\n\napp.Run();\n"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "type": "directory",
    //                 "name": "TestProject",
    //                 "contents": []
    //             }
    //         ],
    //         "aiAnalysis": "The provided solution fails to address the required functionality, specifically in the `CreateProperty` method where it should throw a `PropertyAddressException` when an invalid address is provided, but instead, it simply creates the property without any validation. The logs also indicate that the `GetPropertiesSortedByPriceDesc` method is returning a 400 Bad Request error, suggesting that the sorting functionality is not implemented correctly. The `GetTenants` method is also returning a null value, indicating that the data retrieval is not functioning as expected. \n\nThe solution is not correctly implementing the one-to-many relationship between `Property` and `Tenant` entities, and the exception handling is also not correctly implemented, leading to the failed test cases. \nThe final analysis is that the provided solution has significant gaps in its implementation, including missing validation, incorrect data retrieval, and inadequate exception handling, resulting in failed test cases. The solution requires a thorough review and revision to address these issues and align with the expected functionality. The revised solution should focus on implementing the required validation, correcting the data retrieval, and enhancing the exception handling to ensure that it meets the specified requirements.",
    //         "Test_Submitted_Time": "2025-01-17 | 05:06:36 PM",
    //         "SonarAddedTime": "2025-01-17 | 05:04:04 PM",
    //         "Differnce_In_Submission": "2.53 mins",
    //         "log": [
    //             "{\n  \"passed\": [\n    \"CreateProperty_ReturnsCreatedProperty\",\n    \"CreateTenant_ReturnsCreatedTenant\",\n    \"GetPropertyById_InvalidId_ReturnsNotFound\",\n    \"GetPropertyById_ReturnsProperty\",\n    \"PropertyModel_HasAllProperties\",\n    \"PropertyTenant_Relationship_IsConfiguredCorrectly\",\n    \"UpdateTenant_InvalidId_ReturnsNotFound\",\n    \"UpdateTenant_ReturnsNoContent\",\n    \"CreateProperty_ReturnsCreatedProperty\",\n    \"CreateTenant_ReturnsCreatedTenant\",\n    \"DbContext_HasDbSetProperties\",\n    \"GetPropertyById_InvalidId_ReturnsNotFound\",\n    \"GetPropertyById_ReturnsProperty\",\n    \"PropertyModel_HasAllProperties\",\n    \"PropertyTenant_Relationship_IsConfiguredCorrectly\",\n    \"TenantModel_HasAllProperties\",\n    \"UpdateTenant_InvalidId_ReturnsNotFound\",\n    \"UpdateTenant_ReturnsNoContent\"\n  ],\n  \"failed\": [\n    {\n      \"testName\": \"CreateProperty_ThrowsAddressException_ForInvalidAddress\",\n      \"errorMessage\": \"Expected: InternalServerError\\r\\n  But was:  Created\"\n    },\n    {\n      \"testName\": \"CreateProperty_ThrowsAddressException_ForOtherAddress\",\n      \"errorMessage\": \"Expected: InternalServerError\\r\\n  But was:  Created\"\n    },\n    {\n      \"testName\": \"GetPropertiesSortedByPriceDesc_ReturnsSortedProperties\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Response status code does not indicate success: 400 (Bad Request).\"\n    },\n    {\n      \"testName\": \"GetTenants_ReturnsListOfTenantsWithProperties\",\n      \"errorMessage\": \"Expected: not null\\r\\n  But was:  null\"\n    }\n  ]\n}"
    //         ],
    //         "TestCode": {
    //             "UnitTest1.cs": "using NUnit.Framework;\nusing System.Net;\nusing System.Text;\nusing System.Threading.Tasks;\nusing Microsoft.EntityFrameworkCore;\nusing dotnetapp.Data;\nusing dotnetapp.Models;\nusing System;\nusing System.Net.Http;\nusing Newtonsoft.Json;\nusing System.Linq;\nusing System.Collections.Generic;\n\nnamespace dotnetapp.Tests\n{\n    [TestFixture]\n    public class PropertyTenantControllerTests\n    {\n        private DbContextOptions&lt;ApplicationDbContext&gt; _dbContextOptions;\n        private ApplicationDbContext _context;\n        private HttpClient _httpClient;\n\n        [SetUp]\n        public void Setup()\n        {\n            _httpClient = new HttpClient();\n            _httpClient.BaseAddress = new Uri(\"http://localhost:8080\"); // Base URL of your API\n            _dbContextOptions = new DbContextOptionsBuilder&lt;ApplicationDbContext&gt;()\n                .UseInMemoryDatabase(databaseName: \"TestDatabase\")\n                .Options;\n\n            _context = new ApplicationDbContext(_dbContextOptions);\n        }\n\n        private async Task&lt;int&gt; CreateTestTenantAndGetId(int propertyId)\n        {\n            var newTenant = new Tenant\n            {\n                Name = \"Test Tenant\",\n                Email = \"tenant@example.com\",\n                PropertyId = propertyId\n            };\n\n            var json = JsonConvert.SerializeObject(newTenant);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            var response = await _httpClient.PostAsync(\"api/Tenant\", content);\n            response.EnsureSuccessStatusCode();\n\n            var createdTenant = JsonConvert.DeserializeObject&lt;Tenant&gt;(await response.Content.ReadAsStringAsync());\n            return createdTenant.TenantId;\n        }\n\n        [Test]\n        public async Task CreateProperty_ReturnsCreatedProperty()\n        {\n            // Arrange\n            var newProperty = new Property\n            {\n                Address = \"New York\",\n                RentalPrice = 100.00M,\n                AvailableFrom = \"Test AvailableFrom\"\n            };\n\n            var json = JsonConvert.SerializeObject(newProperty);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Property\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            var createdProperty = JsonConvert.DeserializeObject&lt;Property&gt;(responseContent);\n\n            Assert.IsNotNull(createdProperty);\n            Assert.AreEqual(newProperty.Address, createdProperty.Address);\n            Assert.AreEqual(newProperty.RentalPrice, createdProperty.RentalPrice);\n            Assert.AreEqual(newProperty.AvailableFrom, createdProperty.AvailableFrom);\n        }\n\n        [Test]\n        public async Task CreateTenant_ReturnsCreatedTenant()\n        {\n            // Arrange\n            int propertyId = await CreateTestPropertyAndGetId(); // Dynamically create a valid Property\n\n            var newTenant = new Tenant\n            {\n                Name = \"Test Tenant\",\n                Email = \"tenant@example.com\",\n                PropertyId = propertyId\n            };\n\n            var json = JsonConvert.SerializeObject(newTenant);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Tenant\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            var createdTenant = JsonConvert.DeserializeObject&lt;Tenant&gt;(responseContent);\n\n            Assert.IsNotNull(createdTenant);\n            Assert.AreEqual(newTenant.Name, createdTenant.Name);\n            Assert.AreEqual(newTenant.Email, createdTenant.Email);\n        }\n\n        [Test]\n        public async Task GetPropertiesSortedByPriceDesc_ReturnsSortedProperties()\n        {\n            // Arrange\n            await CreateTestPropertyAndGetId(); // Create propertys to be sorted\n\n            // Act\n            var response = await _httpClient.GetAsync(\"api/Property/SortedByPriceDesc\");\n\n            // Assert\n            response.EnsureSuccessStatusCode();\n            var propertys = JsonConvert.DeserializeObject&lt;Property[]&gt;(await response.Content.ReadAsStringAsync());\n            Assert.IsNotNull(propertys);\n            Assert.AreEqual(propertys.OrderByDescending(e =&gt; e.RentalPrice).ToList(), propertys);\n        }\n\n       [Test]\n        public async Task GetPropertyById_ReturnsProperty()\n        {\n            // Arrange\n            int propertyId = await CreateTestPropertyAndGetId(); // Create a test property and retrieve its ID\n            Console.WriteLine($\"Created Property ID: {propertyId}\");\n\n            // Act\n            var response = await _httpClient.GetAsync($\"api/Property/{propertyId}\");\n            Console.WriteLine($\"Response Status Code: {response.StatusCode}\");\n\n            // Assert the response status code is OK (200)\n            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);\n\n            // Log response content\n            var content = await response.Content.ReadAsStringAsync();\n            Console.WriteLine($\"Response Content: {content}\");\n\n            // Deserialize the response content into an Property object\n            var propertyModel = JsonConvert.DeserializeObject&lt;Property&gt;(content);\n\n            // Ensure the property is not null and that the returned property ID matches the one we created\n            Assert.IsNotNull(propertyModel, \"Property should not be null.\");\n            Assert.AreEqual(propertyId, propertyModel.PropertyId, \"Property ID should match.\");\n        }\n\n        [Test]\n        public async Task UpdateTenant_ReturnsNoContent()\n        {\n            // Arrange\n            int propertyId = await CreateTestPropertyAndGetId();\n            int tenantId = await CreateTestTenantAndGetId(propertyId);\n\n            var updatedTenant = new Tenant\n            {\n                TenantId = tenantId,\n                Name = \"Updated Tenant\",\n                Email = \"updated@example.com\",\n                PropertyId = propertyId\n            };\n\n            var json = JsonConvert.SerializeObject(updatedTenant);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PutAsync($\"api/Tenant/{tenantId}\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.NoContent, response.StatusCode);\n        }\n\n        [Test]\n        public async Task UpdateTenant_InvalidId_ReturnsNotFound()\n        {\n            // Arrange\n            var updatedTenant = new Tenant\n            {\n                TenantId = 9999, // Non-existent ID\n                Name = \"John Doe Updated\",\n                Email = \"john.doe.updated@example.com\"\n            };\n\n            var json = JsonConvert.SerializeObject(updatedTenant);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PutAsync($\"api/Tenant/{updatedTenant.TenantId}\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);\n        }\n\n        [Test]\n    public async Task GetTenants_ReturnsListOfTenantsWithProperties()\n    {\n        // Act\n        var response = await _httpClient.GetAsync(\"api/Tenant\");\n\n        // Assert\n        response.EnsureSuccessStatusCode();\n        var tenants = JsonConvert.DeserializeObject&lt;Tenant[]&gt;(await response.Content.ReadAsStringAsync());\n\n        // Ensure the deserialized tenants array is not null\n        Assert.IsNotNull(tenants);\n        \n        // Ensure that the array contains one or more tenants\n        Assert.IsTrue(tenants.Length &gt; 0);\n            Assert.IsNotNull(tenants[0].Property); // Ensure each property has tenants loaded\n        }\n\n        [Test]\n        public async Task GetPropertyById_InvalidId_ReturnsNotFound()\n        {\n            // Act\n            var response = await _httpClient.GetAsync(\"api/Property/999\");\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);\n        }\n\n        [Test]\n        public void PropertyModel_HasAllProperties()\n        {\n            // Arrange\n            var propertyInstance = new Property\n            {\n                PropertyId = 1,\n                Address = \"New York\",\n                RentalPrice = 100.00M,\n                AvailableFrom = \"Sample AvailableFrom\",\n                Tenants = new List&lt;Tenant&gt;() // Ensure the Tenants collection is properly initialized\n            };\n\n            // Act &amp; Assert\n            Assert.AreEqual(1, propertyInstance.PropertyId, \"PropertyId does not match.\");\n            Assert.AreEqual(\"Sample AvailableFrom\", propertyInstance.AvailableFrom, \"AvailableFrom does not match.\");\n            Assert.AreEqual(100.00M, propertyInstance.RentalPrice, \"RentalPrice does not match.\");\n            Assert.AreEqual(\"New York\", propertyInstance.Address, \"Address does not match.\");\n            Assert.IsNotNull(propertyInstance.Tenants, \"Tenants collection should not be null.\");\n            Assert.IsInstanceOf&lt;ICollection&lt;Tenant&gt;&gt;(propertyInstance.Tenants, \"Tenants should be of type ICollection&lt;Tenant&gt;.\");\n        }\n\n        [Test]\n        public void TenantModel_HasAllProperties()\n        {\n            // Arrange\n            var propertyInstance = new Property\n            {\n                PropertyId = 1,\n                Address = \"New York\",\n                RentalPrice = 100.00M,\n                AvailableFrom = \"Sample AvailableFrom\",\n            };\n\n            var tenant = new Tenant\n            {\n                TenantId = 100,\n                Name = \"John Doe\",\n                Email = \"john.doe@example.com\",\n                PropertyId = 1,\n                Property = propertyInstance\n            };\n\n            // Act &amp; Assert\n            Assert.AreEqual(100, tenant.TenantId, \"TenantId does not match.\");\n            Assert.AreEqual(\"John Doe\", tenant.Name, \"Name does not match.\");\n            Assert.AreEqual(\"john.doe@example.com\", tenant.Email, \"Email does not match.\");\n            Assert.AreEqual(1, tenant.PropertyId, \"PropertyId does not match.\");\n            Assert.IsNotNull(tenant.Property, \"Property should not be null.\");\n            Assert.AreEqual(propertyInstance.Address, tenant.Property.Address, \"Property's Address does not match.\");\n        }\n\n        [Test]\n        public void DbContext_HasDbSetProperties()\n        {\n            // Assert that the context has DbSet properties for Properties and Tenants\n            Assert.IsNotNull(_context.Properties, \"Properties DbSet is not initialized.\");\n            Assert.IsNotNull(_context.Tenants, \"Tenants DbSet is not initialized.\");\n        }\n\n\n        [Test]\n        public void PropertyTenant_Relationship_IsConfiguredCorrectly()\n        {\n            // Check if the Property to Tenant relationship is configured as one-to-many\n            var model = _context.Model;\n            var propertyEntity = model.FindEntityType(typeof(Property));\n            var tenantEntity = model.FindEntityType(typeof(Tenant));\n\n            // Assert that the foreign key relationship exists between Tenant and Property\n            var foreignKey = tenantEntity.GetForeignKeys().FirstOrDefault(fk =&gt; fk.PrincipalEntityType == propertyEntity);\n\n            Assert.IsNotNull(foreignKey, \"Foreign key relationship between Tenant and Property is not configured.\");\n            Assert.AreEqual(\"PropertyId\", foreignKey.Properties.First().Name, \"Foreign key property name is incorrect.\");\n\n            // Check if the cascade delete behavior is set\n            Assert.AreEqual(DeleteBehavior.Cascade, foreignKey.DeleteBehavior, \"Cascade delete behavior is not set correctly.\");\n        }\n\n\n        [Test]\n        public async Task CreateProperty_ThrowsAddressException_ForInvalidAddress()\n        {\n            // Arrange\n            var newProperty = new Property\n            {\n                AvailableFrom = \"Test AvailableFrom\",\n                RentalPrice = 100.00M,\n                Address = \"InvalidAddress\" // Invalid location\n            };\n\n            var json = JsonConvert.SerializeObject(newProperty);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Property\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.InternalServerError, response.StatusCode); // 500 for thrown exception\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            Assert.IsTrue(responseContent.Contains(\"Address 'InvalidAddress' is not allowed.\"), \"Expected error message not found in the response.\");\n        }\n\n        [Test]\n        public async Task CreateProperty_ThrowsAddressException_ForOtherAddress()\n        {\n            // Arrange\n            var newProperty = new Property\n            {\n                AvailableFrom = \"Test AvailableFrom\",\n                RentalPrice = 100.00M,\n                Address = \"Coimbatore\" // Coimbatore location\n            };\n\n            var json = JsonConvert.SerializeObject(newProperty);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Property\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.InternalServerError, response.StatusCode); // 500 for thrown exception\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            Assert.IsTrue(responseContent.Contains(\"Address 'Coimbatore' is not allowed.\"), \"Expected error message not found in the response.\");\n        }\n\n        private async Task&lt;int&gt; CreateTestPropertyAndGetId()\n        {\n            var newProperty = new Property\n            {\n                AvailableFrom = \"Test AvailableFrom\",\n                RentalPrice = 100.00M,\n                Address = \"New York\" // Valid location\n            };\n\n            var json = JsonConvert.SerializeObject(newProperty);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            var response = await _httpClient.PostAsync(\"api/Property\", content);\n            response.EnsureSuccessStatusCode();\n\n            var createdProperty = JsonConvert.DeserializeObject&lt;Property&gt;(await response.Content.ReadAsStringAsync());\n            return createdProperty.PropertyId;\n        }\n\n        [TearDown]\n        public void Cleanup()\n        {\n            _httpClient.Dispose();\n        }\n    }\n}\n"
    //         }
    //     },
    //     {
    //         "key": "faeecbbbeb322386016cfdbaddbcaeone",
    //         "test_Id": "",
    //         "name": "Konda Arunadevi",
    //         "tcList": [
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CreateProperty_ReturnsCreatedProperty",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CreateTenant_ReturnsCreatedTenant",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "GetPropertiesSortedByPriceDesc_ReturnsSortedProperties",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "GetPropertyById_ReturnsProperty",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "UpdateTenant_ReturnsNoContent",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "UpdateTenant_InvalidId_ReturnsNotFound",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "GetTenants_ReturnsListOfTenantsWithProperties",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "GetPropertyById_InvalidId_ReturnsNotFound",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "PropertyModel_HasAllProperties",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "TenantModel_HasAllProperties",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "DbContext_HasDbSetProperties",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "PropertyTenant_Relationship_IsConfiguredCorrectly",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CreateProperty_ThrowsAddressException_ForInvalidAddress",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CreateProperty_ThrowsAddressException_ForOtherAddress",
    //                 "result": "Failure"
    //             }
    //         ],
    //         "QuestionData": "<p><strong>Develop a WEB API Project for Property Rental Management system</strong></p><p><br></p><p><strong>Problem Statement:</strong></p><p>Develop a WEB API project for a Property Rental Management system using ASP.NET Core. The API will provide services for managing properties and tenants. Your task is to design and implement the API based on the given requirements, focusing on action methods, controllers, endpoints, and appropriate status codes.</p><p><br></p><p><strong>Models:</strong></p><ul><li>Create a folder named Models. </li><li>You will define two models: <strong>Tenant</strong> and <strong>Property</strong>.<strong> </strong>These models represent the structure of the data you’ll be working with.  For example:</li></ul><p><br></p><p><strong>1.Tenant</strong></p><p><strong>Properties:</strong></p><ul><li><strong>TenantId</strong> <strong>(int)</strong>: Unique identifier for the tenant.</li><li><strong>Name (string): </strong>Name of the tenant.</li><li><strong>Email (string): </strong>Email address of the tenant.</li><li><strong>PropertyId (int?):</strong> Foreign key linking to the associated Property.</li><li><strong>Property (Property?): </strong>Navigation property to the associated Property.</li></ul><p><br></p><p><strong>2.Property:</strong></p><p><strong>Properties:</strong></p><ul><li><strong>PropertyId (int): </strong>Unique identifier for the property.</li><li><strong>Address (string): </strong>Address of the property.</li><li><strong>RentalPrice (decimal): </strong>Monthly rental price for the property.</li><li><strong>AvailableFrom (string): </strong>Date when the property becomes available for rent.</li><li><strong>Tenants (ICollection&lt;Tenant&gt;?): </strong>Collection of tenants associated with the property. <span style=\"color: rgb(51, 51, 51);\">The</span><strong style=\"color: rgb(51, 51, 51);\"> [JsonIgnore]</strong><span style=\"color: rgb(51, 51, 51);\"> attribute is applied to this property, indicating that it should be excluded from JSON serialization.</span></li></ul><p><br></p><p>Using <strong>ApplicationDbContext</strong> for Tentant and Property Management. ApplicationDbContext must be present inside the folder Data. </p><p><strong>\tNamespace - dotnetapp.Data</strong></p><p><br></p><p>The <strong>ApplicationDbContext</strong> class acts as the primary interface between the application and the database, managing CRUD (Create, Read, Update, Delete) operations for <strong>Property</strong> entities and (Create, Read, Update, Delete) operations for <strong>Tenant</strong> entities. This context class defines the database schema through its DbSet properties and manages the <strong>one-to-many relationship </strong>between Property and Tenant.</p><p><br></p><p><strong>DbSet Properties:</strong></p><p><br></p><p><strong>DbSet&lt;Property&gt; Properties:</strong> </p><p>Represents a collection of Property entities stored in the Properties table. Each Property can have multiple associated Tenant entries, defining the <strong>one-to-many relationship </strong>between Property and Tenant (i.e., one property can be rented by many tenants over time).</p><p><br></p><p><strong>DbSet&lt;Tenant&gt; Tenants: </strong></p><p>Represents a collection of Tenant entities stored in the Tenants table. Each Tenant is associated with a single Property, establishing a <strong>many-to-one relationship</strong> with the Tenant entity.</p><p><br></p><p><strong>Configuration:</strong></p><p><strong>One-to-Many Relationship: </strong>Configures the relationship where one Property can have many Tenants.</p><p><br></p><p><strong>Implement the actual logic in the controller:</strong></p><p><br></p><p><strong>Controllers: Namespace: dotnetapp.Controllers</strong></p><p><br></p><p><strong>TenantController</strong></p><p><br></p><ul><li><strong>GetTenants() -</strong> Retrieves a list of all tenants along with their associated properties. If no tenants are found, it returns a <strong>204 No Content</strong>. Otherwise, it returns a <strong>200 OK</strong> with a list of tenants and their related property details.</li><li><strong>CreateTenant([FromBody] Tenant tenant) -</strong> Adds a new tenant to the database. If the <strong>PropertyId</strong> is not provided, it returns a <strong>400 Bad Request</strong> with an error message. Upon successful creation, it returns a <strong>201 Created</strong> with the location of the newly created tenant.</li><li><strong>UpdateTenant(int id, [FromBody] Tenant tenant) - </strong>Updates an existing tenant identified by<strong> id</strong>. If the provided id does not match the TenantId in the request body or if the tenant does not exist, <strong>404 Not Found, </strong>respectively. On successful update, it returns <strong>204 No Content.</strong></li></ul><p><br></p><p><strong>PropertyController</strong></p><p><br></p><ul><li><strong>GetProperty(int id)</strong> - Retrieves a single property by their <strong>PropertyId</strong> along with their associated tenants. If the property is not found, it returns a<strong> 404 Not Found.</strong> If found, it returns a<strong> 200 OK</strong> with the property details and their related tenants.</li><li><strong>CreateProperty([FromBody] Property </strong>propertyModel<strong>) -</strong> Adds a new propertyModel to the database. Upon successful creation, it returns a<strong> 201 Created </strong>with the address of the newly created propertyModel. A <strong>PropertyAddressException</strong> is thrown for invalid addresses with<strong> 500 status code</strong>.</li><li><strong>GetPropertiesSortedByPriceDesc()</strong> - Retrieves all properties sorted by rental price in descending order. <strong>200 OK</strong> is returned with a sorted list of properties and their tenants.</li></ul><p><br></p><p><strong>PropertyAddressException:</strong></p><p><br></p><p><strong>Namespace: dotnetapp.Exceptions</strong></p><p><strong>Description:</strong> A custom exception thrown when a property’s address is not among the allowed address. This exception is used to enforce address constraints for properties, ensuring that only specific, predefined address are accepted.</p><p><br></p><p><strong>Allowed Address:</strong></p><p>The property’s address must be one of the following:</p><ul><li><strong>\"New York\"</strong></li><li><strong>\"San Francisco\"</strong></li></ul><p><strong>Error Message Format:</strong></p><ul><li>When the exception is thrown, the error message follows the format: </li><li class=\"ql-indent-1\"><strong>\"Address '{propertyModel.Address}' is not allowed. Only allowed address are: {string.Join(\", \", AllowedAddress)}.\"</strong></li><li>This message provides a specific indication of the invalid address and lists the allowed address.</li></ul><p><br></p><p><strong>Endpoints:</strong></p><p><br></p><p><strong>Tenants:</strong></p><p><br></p><ul><li><strong>GET /api/Tenant </strong>- Retrieve a list of all tenants, including their associated properties.</li><li><strong>POST /api/Tenant</strong> - Create a new tenant. Requires a <strong>PropertyId</strong>.</li><li><strong>PUT /api/Tenant/{id}</strong> - Update an existing tenant by its <strong>ID</strong>.</li></ul><p><br></p><p><strong>Properties:</strong></p><ul><li><strong>GET /api/Property/{id} </strong>- Retrieve a specific property by their ID, including their associated tenants.</li><li><strong>POST /api/Property</strong> - Create a new property.</li><li><strong style=\"color: rgb(51, 51, 51);\">GET /api/Property/SortedByPriceDesc - </strong>Retrieves all properties sorted by rental price in descending order. </li></ul><p><br></p><p><strong>Status Codes and Error Handling:</strong></p><p><strong>204 No Content:</strong> Returned when no records are found for tenants or properties.</p><p><strong>200 OK:</strong> Returned when records are successfully retrieved.</p><p><strong>201 Created:</strong> Returned when a new tenant or property is successfully created.</p><p><strong>400 Bad Request: </strong>Returned when there are validation errors or mismatched IDs during updates.</p><p><strong>404 Not Found:</strong> Returned when a tenant or property is not found during retrieval or deletion.</p><p><strong style=\"color: rgb(51, 51, 51);\">PropertyAddressException: </strong><span style=\"color: rgb(51, 51, 51);\">Thrown when the </span><strong style=\"color: rgb(51, 51, 51);\">Address </strong><span style=\"color: rgb(51, 51, 51);\">in a property is invalid address, with the message: \"</span><strong style=\"color: rgb(51, 51, 51);\">Address '{propertyModel.Address}' is not allowed. Only allowed address are: {string.Join(\", \", AllowedAddress)}.\". </strong><span style=\"color: rgb(51, 51, 51);\">This</span><strong style=\"color: rgb(51, 51, 51);\"> </strong><span style=\"color: rgb(51, 51, 51);\">exception should return</span><strong style=\"color: rgb(51, 51, 51);\"> status code 500</strong><span style=\"color: rgb(51, 51, 51);\">.</span><strong style=\"color: rgb(51, 51, 51);\"> </strong></p><p><br></p><p><strong><u>Note:</u></strong></p><ul><li>Use swagger/index to view the API output screen in 8080 port.</li><li>Don't delete any files in the project environment.</li><li>When clicking on Run Testcase button make sure that your application is running on the port 8080.</li></ul><p><br></p><p><strong>Commands to Run the Project:</strong></p><ul><li><strong>cd dotnetapp</strong></li></ul><p>Select the dotnet project folder</p><ul><li><strong>dotnet restore</strong></li></ul><p>This command will restore all the required packages to run the application.</p><ul><li><strong>dotnet dotnet-ef migrations add initialsetup</strong> </li></ul><p>This command is to add migrations</p><ul><li><strong>dotnet dotnet-ef database update </strong></li></ul><p>This command is to update the database.</p><ul><li><strong>dotnet run</strong></li></ul><p>To run the application in port 8080 (The settings preloaded click 8080 Port to View)</p><ul><li><strong>dotnet build</strong></li></ul><p>To build and check for errors</p><ul><li><strong>dotnet clean</strong></li></ul><p>If the same error persists clean the project and build again</p><p><br></p><p><br></p><p><strong>For Entity Framework Core:</strong></p><p>To use</p><p>Entity Framework :</p><p>Install EF:</p><p><strong>dotnet new tool-manifest</strong></p><p><strong>dotnet tool install --local dotnet-ef --version 6.0.6</strong></p><p>--Then use dotnet dotnet-ef instead of dotnet-ef.</p><p><strong>&nbsp;dotnet dotnet-ef</strong></p><p>--To check the EF installed or not</p><p><strong>dotnet dotnet-ef migrations add \"InitialSetup\"</strong></p><p>--command to setup initial creating of tables mentioned iin DBContext</p><p><strong>dotnet dotnet-ef database update</strong></p><p>--command to update the database</p><p><strong>Note:</strong></p><p><strong>Use the below sample connection string to connect the MsSql Server</strong></p><p><strong>&nbsp;private string connectionString </strong>= \"User ID=sa;password=examlyMssql@123; server=localhost;Database=appdb;trusted_connection=false;Persist Security Info=False;Encrypt=False\"</p>",
    //         "codeComponents": [
    //             {
    //                 "type": "directory",
    //                 "name": "dotnetapp",
    //                 "contents": [
    //                     {
    //                         "type": "directory",
    //                         "name": "Controllers",
    //                         "contents": [
    //                             {
    //                                 "type": "file",
    //                                 "name": "PropertyController.cs",
    //                                 "code": "using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Threading.Tasks;\nusing dotnetapp.Data;\nusing dotnetapp.Models;\nusing dotnetapp.Exceptions;\nusing Microsoft.EntityFrameworkCore;\nusing Microsoft.AspNetCore.Mvc;\n\nnamespace dotnetapp.Controllers\n{\n    [ApiController]\n    [Route(\"api/[controller]\")]\n    public class PropertyController : ControllerBase\n    {\n        public readonly ApplicationDbContext db;\n        public PropertyController(ApplicationDbContext db1)\n        {\n            db = db1;\n        }\n        [HttpGet(\"{id}\")]\n        public async Task&lt;ActionResult&gt; GetProperty(int id)\n        {\n            var property = db.Properties.Include(c=&gt;c.Tenants).FirstOrDefault(p=&gt;p.PropertyId==id);\n            if (property == null)\n            {\n                return NotFound();\n            }\n            return Ok(property);\n        }\n        [HttpPost]\n        public async Task&lt;ActionResult&gt; CreateProperty([FromBody] Property propertyModel)\n        {\n            try\n            {\n                var pro = db.Properties.Where(c =&gt; c.PropertyId == propertyModel.PropertyId);\n                if (pro == null)\n                {\n                    return BadRequest();\n                }\n                if (propertyModel.Address != \"New York\" || propertyModel.Address != \"San Francisco\")\n                {\n                    throw new PropertyAddressException($\"Address '{propertyModel.Address}' is not allowed. Only allowed address are: New York,San Francisco.\");\n                }\n                db.Properties.Add(propertyModel);\n                db.SaveChanges();\n                return CreatedAtAction(nameof(CreateProperty), new { id = propertyModel.PropertyId }, propertyModel);\n            }\n            catch (PropertyAddressException ex)\n            {\n                return StatusCode(500, ex.Message);\n            }\n            catch(Exception e)\n            {\n                return StatusCode(400,e.Message);\n            }\n        }\n        [HttpGet(\"SortedByPriceDesc\")]\n        public async Task&lt;ActionResult&gt; GetPropertiesSortedByPriceDesc()\n        {\n            var sortprice = db.Properties.OrderByDescending(c=&gt;c.RentalPrice).ToList();\n            if (sortprice.Count == 0)\n            {\n                return NotFound();\n            }\n            return Ok(sortprice);\n        }\n    }\n}"
    //                             },
    //                             {
    //                                 "type": "file",
    //                                 "name": "TenantController.cs",
    //                                 "code": "using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Threading.Tasks;\nusing dotnetapp.Data;\nusing dotnetapp.Models;\nusing Microsoft.EntityFrameworkCore;\nusing Microsoft.AspNetCore.Mvc;\n\nnamespace dotnetapp.Controllers\n{\n    [ApiController]\n    [Route(\"api/[controller]\")]\n    public class TenantController : ControllerBase\n    {\n        public readonly ApplicationDbContext db;\n        public TenantController(ApplicationDbContext db1)\n        {\n            db = db1;\n        }\n        [HttpGet]\n        public async Task&lt;ActionResult&gt; GetTenants()\n        {\n            var tenant = db.Tenants.Include(c=&gt;c.Property).ToList();\n            if(tenant==null)\n            {\n                return NoContent();\n            }\n           \n            return Ok(tenant);\n            \n        }\n        [HttpPost]\n        public async Task&lt;ActionResult&gt; CreateTenant([FromBody] Tenant tenant)\n        {\n            // var pro = db.Tenants.Include(c=&gt;c.Property).FirstOrDefault(c=&gt;c.TenantId==tenant.TenantId);\n            if(tenant==null)\n            {\n                return BadRequest();\n            }\n            db.Tenants.Add(tenant);\n            db.SaveChanges();\n            return CreatedAtAction(nameof(CreateTenant), new {id = tenant.TenantId}, tenant);\n        }\n        private bool TenantExists(int id)\n        {\n            var pro = db.Tenants.Any(c=&gt;c.TenantId==id);\n            if(!pro)\n            {\n                return false;\n            }\n            return true;\n\n        }\n        [HttpPut(\"{id}\")]\n        public async Task&lt;ActionResult&gt; UpdateTenant(int id,[FromBody] Tenant tenant)\n        {\n            if(id != tenant.TenantId)\n            {\n                return BadRequest();\n            }\n            if(!TenantExists(id))\n            {\n                return NotFound();\n            }\n            // var pro = db.Tenants.FirstOrDefault(c=&gt;c.TenantId==id);\n            // pro.TenantId = tenant.TenantId;\n            // pro.Name = tenant.Name;\n            // pro.Email = tenant.Email;\n            db.Entry(tenant).State = EntityState.Modified;\n            db.SaveChanges();\n            return NoContent();\n        }\n    }\n}"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "directory",
    //                         "name": "Data",
    //                         "contents": [
    //                             {
    //                                 "type": "file",
    //                                 "name": "ApplicationDbContext.cs",
    //                                 "code": "using Microsoft.EntityFrameworkCore;\nusing System;\nusing dotnetapp.Models;\nusing System.Runtime.InteropServices.ComTypes;\nnamespace dotnetapp.Data\n{\n    public class ApplicationDbContext : DbContext\n    {\n        public ApplicationDbContext(DbContextOptions&lt;ApplicationDbContext&gt; options)\n            : base(options)\n        {\n        }\n\n       public DbSet&lt;Property&gt; Properties{get;set;}\n       public DbSet&lt;Tenant&gt; Tenants{get;set;}\n\n        protected override void OnModelCreating(ModelBuilder modelBuilder)\n        {\n            modelBuilder.Entity&lt;Property&gt;()\n            .HasMany(c=&gt;c.Tenants)\n            .WithOne(d=&gt;d.Property)\n            .HasForeignKey(f=&gt;f.PropertyId)\n            .OnDelete(DeleteBehavior.Cascade);    \n        }\n    }\n}\n"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "directory",
    //                         "name": "Exceptions",
    //                         "contents": [
    //                             {
    //                                 "type": "file",
    //                                 "name": "PropertyAddressException.cs",
    //                                 "code": "using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Threading.Tasks;\nusing dotnetapp.Models;\nusing dotnetapp.Data;\nnamespace dotnetapp.Exceptions\n{\n    public class PropertyAddressException : Exception\n    {\n        public PropertyAddressException(){}\n        public PropertyAddressException(string message) : base (message)\n        {\n            \n        }\n    }\n\n}"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "directory",
    //                         "name": "Models",
    //                         "contents": [
    //                             {
    //                                 "type": "file",
    //                                 "name": "Property.cs",
    //                                 "code": "using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Threading.Tasks;\nusing System.Text.Json.Serialization;\nusing System.ComponentModel.DataAnnotations;\nusing System.Collections.Generic;\n\nnamespace dotnetapp.Models\n{\n    public class Property\n    {\n        public int PropertyId{get;set;}\n        public string Address{get;set;}\n        public decimal RentalPrice{get;set;}\n        public string AvailableFrom{get;set;}\n        //[JsonIgnore]\n        public ICollection&lt;Tenant&gt;? Tenants {get;set;}\n\n\n    }\n}"
    //                             },
    //                             {
    //                                 "type": "file",
    //                                 "name": "Tenant.cs",
    //                                 "code": "using System;\nusing System.Collections.Generic;\nusing System.Linq;\nusing System.Threading.Tasks;\nusing System.ComponentModel.DataAnnotations;\nusing System.Text.Json.Serialization;\n\nnamespace dotnetapp.Models\n{\n    public class Tenant\n    {\n        public int TenantId{get;set;}\n        public string Name{get;set;}\n        public string Email{get;set;}\n        public int? PropertyId{get;set;}\n        [JsonIgnore]\n        public Property? Property{get;set;}\n    }\n}"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "file",
    //                         "name": "Program.cs",
    //                         "code": "using dotnetapp.Data;\nusing Microsoft.EntityFrameworkCore;\nusing Microsoft.AspNetCore.Mvc;\n\nvar builder = WebApplication.CreateBuilder(args);\n\n// Add services to the container.\n\nbuilder.Services.AddControllers();\n// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle\nbuilder.Services.AddEndpointsApiExplorer();\nbuilder.Services.AddSwaggerGen();\nbuilder.Services.AddDbContext&lt;ApplicationDbContext&gt;(options=&gt;options.UseSqlServer(builder.Configuration.GetConnectionString(\"conn\")));\n\nvar app = builder.Build();\n\n// Configure the HTTP request pipeline.\nif (app.Environment.IsDevelopment())\n{\n    app.UseSwagger();\n    app.UseSwaggerUI();\n}\n\napp.UseHttpsRedirection();\n\napp.UseAuthorization();\n\napp.MapControllers();\n\napp.Run();\n"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "type": "directory",
    //                 "name": "TestProject",
    //                 "contents": []
    //             }
    //         ],
    //         "aiAnalysis": "The provided solution has several issues, including incorrect validation in the `CreateProperty` method of `PropertyController`, where the condition `if (propertyModel.Address != \"New York\" || propertyModel.Address != \"San Francisco\")` will always return true, and the `CreateTenant` method in `TenantController` does not check if the provided `PropertyId` is valid. The `UpdateTenant` method in `TenantController` also does not handle the case where the `PropertyId` is changed. The solution also lacks error handling and logging mechanisms, which makes it difficult to diagnose and fix issues.\n\nThe provided logs indicate that the solution is failing due to a `HttpRequestException` caused by a `SocketException`, which suggests that the application is unable to connect to the database or is experiencing network issues. The solution's inability to handle these exceptions properly is exacerbating the problem. The lack of correct error handling and logging is making it challenging to identify the root cause of the issue.\n\nFinal analysis: The solution has several logical and syntactical errors, particularly in the validation and error handling mechanisms, which are causing it to fail. The incorrect validation and lack of error handling are resulting in unexpected behavior and prevent the solution from meeting the requirements outlined in the description. Overall, the solution requires significant improvements to its validation, error handling, and logging mechanisms to function correctly and meet the expected outcomes.",
    //         "Test_Submitted_Time": "2025-01-17 | 04:58:09 PM",
    //         "SonarAddedTime": "2025-01-17 | 04:53:36 PM",
    //         "Differnce_In_Submission": "4.55 mins",
    //         "log": [
    //             "{\n  \"passed\": [\n    \"DbContext_HasDbSetProperties\",\n    \"PropertyModel_HasAllProperties\",\n    \"PropertyTenant_Relationship_IsConfiguredCorrectly\",\n    \"TenantModel_HasAllProperties\",\n    \"DbContext_HasDbSetProperties\",\n    \"PropertyModel_HasAllProperties\",\n    \"PropertyTenant_Relationship_IsConfiguredCorrectly\",\n    \"TenantModel_HasAllProperties\"\n  ],\n  \"failed\": [\n    {\n      \"testName\": \"CreateProperty_ReturnsCreatedProperty\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Cannot assign requested address (localhost:8080)\\r\\n  ----> System.Net.Sockets.SocketException : Cannot assign requested address\"\n    },\n    {\n      \"testName\": \"CreateProperty_ThrowsAddressException_ForInvalidAddress\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Cannot assign requested address (localhost:8080)\\r\\n  ----> System.Net.Sockets.SocketException : Cannot assign requested address\"\n    },\n    {\n      \"testName\": \"CreateProperty_ThrowsAddressException_ForOtherAddress\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Cannot assign requested address (localhost:8080)\\r\\n  ----> System.Net.Sockets.SocketException : Cannot assign requested address\"\n    },\n    {\n      \"testName\": \"CreateTenant_ReturnsCreatedTenant\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Cannot assign requested address (localhost:8080)\\r\\n  ----> System.Net.Sockets.SocketException : Cannot assign requested address\"\n    },\n    {\n      \"testName\": \"GetPropertiesSortedByPriceDesc_ReturnsSortedProperties\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Cannot assign requested address (localhost:8080)\\r\\n  ----> System.Net.Sockets.SocketException : Cannot assign requested address\"\n    },\n    {\n      \"testName\": \"GetPropertyById_InvalidId_ReturnsNotFound\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Cannot assign requested address (localhost:8080)\\r\\n  ----> System.Net.Sockets.SocketException : Cannot assign requested address\"\n    },\n    {\n      \"testName\": \"GetPropertyById_ReturnsProperty\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Cannot assign requested address (localhost:8080)\\r\\n  ----> System.Net.Sockets.SocketException : Cannot assign requested address\"\n    },\n    {\n      \"testName\": \"GetTenants_ReturnsListOfTenantsWithProperties\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Cannot assign requested address (localhost:8080)\\r\\n  ----> System.Net.Sockets.SocketException : Cannot assign requested address\"\n    },\n    {\n      \"testName\": \"UpdateTenant_InvalidId_ReturnsNotFound\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Cannot assign requested address (localhost:8080)\\r\\n  ----> System.Net.Sockets.SocketException : Cannot assign requested address\"\n    },\n    {\n      \"testName\": \"UpdateTenant_ReturnsNoContent\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Cannot assign requested address (localhost:8080)\\r\\n  ----> System.Net.Sockets.SocketException : Cannot assign requested address\"\n    }\n  ]\n}"
    //         ],
    //         "TestCode": {
    //             "UnitTest1.cs": "using NUnit.Framework;\nusing System.Net;\nusing System.Text;\nusing System.Threading.Tasks;\nusing Microsoft.EntityFrameworkCore;\nusing dotnetapp.Data;\nusing dotnetapp.Models;\nusing System;\nusing System.Net.Http;\nusing Newtonsoft.Json;\nusing System.Linq;\nusing System.Collections.Generic;\n\nnamespace dotnetapp.Tests\n{\n    [TestFixture]\n    public class PropertyTenantControllerTests\n    {\n        private DbContextOptions&lt;ApplicationDbContext&gt; _dbContextOptions;\n        private ApplicationDbContext _context;\n        private HttpClient _httpClient;\n\n        [SetUp]\n        public void Setup()\n        {\n            _httpClient = new HttpClient();\n            _httpClient.BaseAddress = new Uri(\"http://localhost:8080\"); // Base URL of your API\n            _dbContextOptions = new DbContextOptionsBuilder&lt;ApplicationDbContext&gt;()\n                .UseInMemoryDatabase(databaseName: \"TestDatabase\")\n                .Options;\n\n            _context = new ApplicationDbContext(_dbContextOptions);\n        }\n\n        private async Task&lt;int&gt; CreateTestTenantAndGetId(int propertyId)\n        {\n            var newTenant = new Tenant\n            {\n                Name = \"Test Tenant\",\n                Email = \"tenant@example.com\",\n                PropertyId = propertyId\n            };\n\n            var json = JsonConvert.SerializeObject(newTenant);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            var response = await _httpClient.PostAsync(\"api/Tenant\", content);\n            response.EnsureSuccessStatusCode();\n\n            var createdTenant = JsonConvert.DeserializeObject&lt;Tenant&gt;(await response.Content.ReadAsStringAsync());\n            return createdTenant.TenantId;\n        }\n\n        [Test]\n        public async Task CreateProperty_ReturnsCreatedProperty()\n        {\n            // Arrange\n            var newProperty = new Property\n            {\n                Address = \"New York\",\n                RentalPrice = 100.00M,\n                AvailableFrom = \"Test AvailableFrom\"\n            };\n\n            var json = JsonConvert.SerializeObject(newProperty);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Property\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            var createdProperty = JsonConvert.DeserializeObject&lt;Property&gt;(responseContent);\n\n            Assert.IsNotNull(createdProperty);\n            Assert.AreEqual(newProperty.Address, createdProperty.Address);\n            Assert.AreEqual(newProperty.RentalPrice, createdProperty.RentalPrice);\n            Assert.AreEqual(newProperty.AvailableFrom, createdProperty.AvailableFrom);\n        }\n\n        [Test]\n        public async Task CreateTenant_ReturnsCreatedTenant()\n        {\n            // Arrange\n            int propertyId = await CreateTestPropertyAndGetId(); // Dynamically create a valid Property\n\n            var newTenant = new Tenant\n            {\n                Name = \"Test Tenant\",\n                Email = \"tenant@example.com\",\n                PropertyId = propertyId\n            };\n\n            var json = JsonConvert.SerializeObject(newTenant);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Tenant\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            var createdTenant = JsonConvert.DeserializeObject&lt;Tenant&gt;(responseContent);\n\n            Assert.IsNotNull(createdTenant);\n            Assert.AreEqual(newTenant.Name, createdTenant.Name);\n            Assert.AreEqual(newTenant.Email, createdTenant.Email);\n        }\n\n        [Test]\n        public async Task GetPropertiesSortedByPriceDesc_ReturnsSortedProperties()\n        {\n            // Arrange\n            await CreateTestPropertyAndGetId(); // Create propertys to be sorted\n\n            // Act\n            var response = await _httpClient.GetAsync(\"api/Property/SortedByPriceDesc\");\n\n            // Assert\n            response.EnsureSuccessStatusCode();\n            var propertys = JsonConvert.DeserializeObject&lt;Property[]&gt;(await response.Content.ReadAsStringAsync());\n            Assert.IsNotNull(propertys);\n            Assert.AreEqual(propertys.OrderByDescending(e =&gt; e.RentalPrice).ToList(), propertys);\n        }\n\n       [Test]\n        public async Task GetPropertyById_ReturnsProperty()\n        {\n            // Arrange\n            int propertyId = await CreateTestPropertyAndGetId(); // Create a test property and retrieve its ID\n            Console.WriteLine($\"Created Property ID: {propertyId}\");\n\n            // Act\n            var response = await _httpClient.GetAsync($\"api/Property/{propertyId}\");\n            Console.WriteLine($\"Response Status Code: {response.StatusCode}\");\n\n            // Assert the response status code is OK (200)\n            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode);\n\n            // Log response content\n            var content = await response.Content.ReadAsStringAsync();\n            Console.WriteLine($\"Response Content: {content}\");\n\n            // Deserialize the response content into an Property object\n            var propertyModel = JsonConvert.DeserializeObject&lt;Property&gt;(content);\n\n            // Ensure the property is not null and that the returned property ID matches the one we created\n            Assert.IsNotNull(propertyModel, \"Property should not be null.\");\n            Assert.AreEqual(propertyId, propertyModel.PropertyId, \"Property ID should match.\");\n        }\n\n        [Test]\n        public async Task UpdateTenant_ReturnsNoContent()\n        {\n            // Arrange\n            int propertyId = await CreateTestPropertyAndGetId();\n            int tenantId = await CreateTestTenantAndGetId(propertyId);\n\n            var updatedTenant = new Tenant\n            {\n                TenantId = tenantId,\n                Name = \"Updated Tenant\",\n                Email = \"updated@example.com\",\n                PropertyId = propertyId\n            };\n\n            var json = JsonConvert.SerializeObject(updatedTenant);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PutAsync($\"api/Tenant/{tenantId}\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.NoContent, response.StatusCode);\n        }\n\n        [Test]\n        public async Task UpdateTenant_InvalidId_ReturnsNotFound()\n        {\n            // Arrange\n            var updatedTenant = new Tenant\n            {\n                TenantId = 9999, // Non-existent ID\n                Name = \"John Doe Updated\",\n                Email = \"john.doe.updated@example.com\"\n            };\n\n            var json = JsonConvert.SerializeObject(updatedTenant);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PutAsync($\"api/Tenant/{updatedTenant.TenantId}\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);\n        }\n\n        [Test]\n    public async Task GetTenants_ReturnsListOfTenantsWithProperties()\n    {\n        // Act\n        var response = await _httpClient.GetAsync(\"api/Tenant\");\n\n        // Assert\n        response.EnsureSuccessStatusCode();\n        var tenants = JsonConvert.DeserializeObject&lt;Tenant[]&gt;(await response.Content.ReadAsStringAsync());\n\n        // Ensure the deserialized tenants array is not null\n        Assert.IsNotNull(tenants);\n        \n        // Ensure that the array contains one or more tenants\n        Assert.IsTrue(tenants.Length &gt; 0);\n            Assert.IsNotNull(tenants[0].Property); // Ensure each property has tenants loaded\n        }\n\n        [Test]\n        public async Task GetPropertyById_InvalidId_ReturnsNotFound()\n        {\n            // Act\n            var response = await _httpClient.GetAsync(\"api/Property/999\");\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);\n        }\n\n        [Test]\n        public void PropertyModel_HasAllProperties()\n        {\n            // Arrange\n            var propertyInstance = new Property\n            {\n                PropertyId = 1,\n                Address = \"New York\",\n                RentalPrice = 100.00M,\n                AvailableFrom = \"Sample AvailableFrom\",\n                Tenants = new List&lt;Tenant&gt;() // Ensure the Tenants collection is properly initialized\n            };\n\n            // Act &amp; Assert\n            Assert.AreEqual(1, propertyInstance.PropertyId, \"PropertyId does not match.\");\n            Assert.AreEqual(\"Sample AvailableFrom\", propertyInstance.AvailableFrom, \"AvailableFrom does not match.\");\n            Assert.AreEqual(100.00M, propertyInstance.RentalPrice, \"RentalPrice does not match.\");\n            Assert.AreEqual(\"New York\", propertyInstance.Address, \"Address does not match.\");\n            Assert.IsNotNull(propertyInstance.Tenants, \"Tenants collection should not be null.\");\n            Assert.IsInstanceOf&lt;ICollection&lt;Tenant&gt;&gt;(propertyInstance.Tenants, \"Tenants should be of type ICollection&lt;Tenant&gt;.\");\n        }\n\n        [Test]\n        public void TenantModel_HasAllProperties()\n        {\n            // Arrange\n            var propertyInstance = new Property\n            {\n                PropertyId = 1,\n                Address = \"New York\",\n                RentalPrice = 100.00M,\n                AvailableFrom = \"Sample AvailableFrom\",\n            };\n\n            var tenant = new Tenant\n            {\n                TenantId = 100,\n                Name = \"John Doe\",\n                Email = \"john.doe@example.com\",\n                PropertyId = 1,\n                Property = propertyInstance\n            };\n\n            // Act &amp; Assert\n            Assert.AreEqual(100, tenant.TenantId, \"TenantId does not match.\");\n            Assert.AreEqual(\"John Doe\", tenant.Name, \"Name does not match.\");\n            Assert.AreEqual(\"john.doe@example.com\", tenant.Email, \"Email does not match.\");\n            Assert.AreEqual(1, tenant.PropertyId, \"PropertyId does not match.\");\n            Assert.IsNotNull(tenant.Property, \"Property should not be null.\");\n            Assert.AreEqual(propertyInstance.Address, tenant.Property.Address, \"Property's Address does not match.\");\n        }\n\n        [Test]\n        public void DbContext_HasDbSetProperties()\n        {\n            // Assert that the context has DbSet properties for Properties and Tenants\n            Assert.IsNotNull(_context.Properties, \"Properties DbSet is not initialized.\");\n            Assert.IsNotNull(_context.Tenants, \"Tenants DbSet is not initialized.\");\n        }\n\n\n        [Test]\n        public void PropertyTenant_Relationship_IsConfiguredCorrectly()\n        {\n            // Check if the Property to Tenant relationship is configured as one-to-many\n            var model = _context.Model;\n            var propertyEntity = model.FindEntityType(typeof(Property));\n            var tenantEntity = model.FindEntityType(typeof(Tenant));\n\n            // Assert that the foreign key relationship exists between Tenant and Property\n            var foreignKey = tenantEntity.GetForeignKeys().FirstOrDefault(fk =&gt; fk.PrincipalEntityType == propertyEntity);\n\n            Assert.IsNotNull(foreignKey, \"Foreign key relationship between Tenant and Property is not configured.\");\n            Assert.AreEqual(\"PropertyId\", foreignKey.Properties.First().Name, \"Foreign key property name is incorrect.\");\n\n            // Check if the cascade delete behavior is set\n            Assert.AreEqual(DeleteBehavior.Cascade, foreignKey.DeleteBehavior, \"Cascade delete behavior is not set correctly.\");\n        }\n\n\n        [Test]\n        public async Task CreateProperty_ThrowsAddressException_ForInvalidAddress()\n        {\n            // Arrange\n            var newProperty = new Property\n            {\n                AvailableFrom = \"Test AvailableFrom\",\n                RentalPrice = 100.00M,\n                Address = \"InvalidAddress\" // Invalid location\n            };\n\n            var json = JsonConvert.SerializeObject(newProperty);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Property\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.InternalServerError, response.StatusCode); // 500 for thrown exception\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            Assert.IsTrue(responseContent.Contains(\"Address 'InvalidAddress' is not allowed.\"), \"Expected error message not found in the response.\");\n        }\n\n        [Test]\n        public async Task CreateProperty_ThrowsAddressException_ForOtherAddress()\n        {\n            // Arrange\n            var newProperty = new Property\n            {\n                AvailableFrom = \"Test AvailableFrom\",\n                RentalPrice = 100.00M,\n                Address = \"Coimbatore\" // Coimbatore location\n            };\n\n            var json = JsonConvert.SerializeObject(newProperty);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Property\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.InternalServerError, response.StatusCode); // 500 for thrown exception\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            Assert.IsTrue(responseContent.Contains(\"Address 'Coimbatore' is not allowed.\"), \"Expected error message not found in the response.\");\n        }\n\n        private async Task&lt;int&gt; CreateTestPropertyAndGetId()\n        {\n            var newProperty = new Property\n            {\n                AvailableFrom = \"Test AvailableFrom\",\n                RentalPrice = 100.00M,\n                Address = \"New York\" // Valid location\n            };\n\n            var json = JsonConvert.SerializeObject(newProperty);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            var response = await _httpClient.PostAsync(\"api/Property\", content);\n            response.EnsureSuccessStatusCode();\n\n            var createdProperty = JsonConvert.DeserializeObject&lt;Property&gt;(await response.Content.ReadAsStringAsync());\n            return createdProperty.PropertyId;\n        }\n\n        [TearDown]\n        public void Cleanup()\n        {\n            _httpClient.Dispose();\n        }\n    }\n}\n"
    //         }
    //     }
    // ]
    //         this.updatePaginatedData();

    //         console.log(this.responseinJson);

        // this.showProcess("Analysis is InProcess...");

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

            console.log(this.responseinJson);

            this.updatePaginatedData();


            console.log('Parsed responseinJson:', this.responseinJson);
            // this.openResultDialog(response);


            // this.responseText = JSON.stringify(response.jsonObjects, null, 2);
            // console.log(this.responseText);

          },
          (error) => {
            console.error('Upload failed:', error.error.error);
            console.log(error.error.error);

            this.errorMessage = error.error.error;
            this.mess = true

            // setTimeout(() => {
            //   this.errorMessage = '';
            // this.mess = false
            // }, 3000);
            this.showError(this.errorMessage);

          // this.download = false;
          // this.downloadsh = false;

          //   this.responseText = 'Upload failed';
          }
        ).add(() => {
          this.loading = false; // Hide loading indicator when request completes
        });
      }
    }
    onPageChange(event: PageEvent): void {
      this.currentPage = event.pageIndex;
      this.pageSize = event.pageSize;
      this.updatePaginatedData();
    }

    updatePaginatedData(): void {
      const startIndex = this.currentPage * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.paginatedData = this.responseinJson.slice(startIndex, endIndex);
    }

    openModal(tcList: any[]): void {
      this.OpenTcListDialog(tcList);
    }
    openQuestionModal(question: any[]): void {
      this.openQuestionDialog(question);
    }
    openLogListModal(logList: any[]): void {
      this.openLogListDialog(logList);
    }
    openSolutionModal(code: any[]): void {
      this.openSolutionDialog(code);
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

      openLogListDialog(response: any): void {
        const dialogRef = this.dialog.open(LogListComponent, {
          width: '400px',
          data: { response,testcases: response },
         });

        dialogRef.afterClosed().subscribe((result: { testcases: any[] }) => {
          if (result) {
            console.log('Testcase edited:', result);
          }
        });

      }
      openSolutionDialog(response: any): void {
        console.log(response);

        const dialogRef = this.dialog.open(SolutionModalComponent, {
          width: '50%',
          height: '80%',
          data: { response, stack:[] },
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
