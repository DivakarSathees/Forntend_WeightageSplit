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
    //       "key": "edcccdaacadcbadafbc321866160fdacdaone",
    //       "test_Id": "https://admin.ltimindtree.iamneo.ai/result?testId=U2FsdGVkX1%2BfegZdPVFRoXMGdfB%2BLfqWdBJxF2fOdmPY5shVtoMhCcBVTRg%2FH3L8A36NAxoHpY79P%2FRPfFbqiu6qKeQzpWP%2BOL18YudJBjty7HI9SbPgu2GWgnPPcWn8Eb6KYNZ7S8OTcVihSZxiPQ%3D%3D",
    //       "name": "Saloni Smriti",
    //       "tcList": [
    //           {
    //               "evaluation_type": "NUnit",
    //               "name": "Test_Exhibition_Class_Should_Exist",
    //               "result": "Compilation Error"
    //           },
    //           {
    //               "evaluation_type": "NUnit",
    //               "name": "Test_Exhibition_Properties_Should_Exist",
    //               "result": "Compilation Error"
    //           },
    //           {
    //               "evaluation_type": "NUnit",
    //               "name": "Test_AddExhibition_Method_Exists",
    //               "result": "Compilation Error"
    //           },
    //           {
    //               "evaluation_type": "NUnit",
    //               "name": "Test_DisplayAllExhibitions_Method_Exists",
    //               "result": "Compilation Error"
    //           },
    //           {
    //               "evaluation_type": "NUnit",
    //               "name": "Test_DeleteExhibition_Method_Exists",
    //               "result": "Compilation Error"
    //           },
    //           {
    //               "evaluation_type": "NUnit",
    //               "name": "Test_UpdateExhibition_Method_Exists",
    //               "result": "Compilation Error"
    //           },
    //           {
    //               "evaluation_type": "NUnit",
    //               "name": "Test_AddExhibition_Should_Insert_Exhibition_Into_Database",
    //               "result": "Compilation Error"
    //           },
    //           {
    //               "evaluation_type": "NUnit",
    //               "name": "Test_DisplayAllExhibitions_Should_Output_All_Exhibitions",
    //               "result": "Compilation Error"
    //           },
    //           {
    //               "evaluation_type": "NUnit",
    //               "name": "Test_DisplayAllExhibitions_Should_Handle_No_Exhibitions_Found",
    //               "result": "Compilation Error"
    //           },
    //           {
    //               "evaluation_type": "NUnit",
    //               "name": "Test_DeleteExhibition_Should_Remove_Exhibition_From_Database",
    //               "result": "Compilation Error"
    //           },
    //           {
    //               "evaluation_type": "NUnit",
    //               "name": "Test_DeleteExhibition_Should_Handle_NonExistent_Exhibition",
    //               "result": "Compilation Error"
    //           },
    //           {
    //               "evaluation_type": "NUnit",
    //               "name": "Test_UpdateExhibition_Should_Update_Exhibition_Info_In_Database",
    //               "result": "Compilation Error"
    //           },
    //           {
    //               "evaluation_type": "NUnit",
    //               "name": "Test_UpdateExhibition_Should_Handle_NonExistent_Exhibition",
    //               "result": "Compilation Error"
    //           }
    //       ],
    //       "QuestionData": "<p><strong>Exhibition Management System</strong></p><p><strong>Objective:</strong></p><p>Create the <strong>Exhibition </strong>table in the <strong>appdb</strong> database with columns for exhibition details. Develop a console-based C# application using ADO.NET to perform Create, Read, Update, and Delete operations on the Exhibition table in a SQL Server database. The application should enable users to add new exhibitions, display all exhibitions, update exhibition information, and delete exhibitions. Implement a combination of connected and disconnected architectures using SqlConnection, SqlCommand, and SqlDataAdapter. All classes, properties, and methods should be public.</p><p><br></p><p><strong>Folder Structure:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-1\"></p><p><br></p><p><strong>Table: </strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-2\"></p><h4><br></h4><p><strong>Classes and Properties:</strong></p><h4><strong style=\"color: rgb(51, 51, 51);\">Exhibition </strong><strong>Class (Models/</strong><strong style=\"color: rgb(51, 51, 51);\">Exhibition </strong><strong>.cs):</strong></h4><p>The <strong>Exhibition </strong>class represents a exhibition entity with the following <strong>public </strong>properties:</p><p><strong>Properties</strong>:</p><ul><li><strong>ExhibitionID </strong>(int): Unique identifier for each exhibition. Auto-incremented in the database.</li><li><strong>Title </strong>(string): The title of the exhibition.</li><li><strong>Venue </strong>(string): The venue where the exhibition will take place.</li><li><strong>Date </strong>(string): The date of the exhibition in \"yyyy-mm-dd\" format.</li><li><strong>TicketPrice </strong>(decimal): The price of the ticket for the exhibition.</li></ul><p><br></p><p><strong>Database Details:</strong></p><ul><li>Database Name: <strong>appdb</strong></li><li>Table Name: <strong style=\"color: rgb(51, 51, 51);\">Exhibition </strong></li><li>Ensure that the database connection is properly established using the <strong>ConnectionStringProvider</strong> class in the file <strong>Program.cs.</strong></li><li>Use the below connection string to connect the MsSql Server</li><li class=\"ql-indent-1\">public static string <strong>ConnectionString </strong>{ get; } = \"User ID=sa;password=examlyMssql@123; server=localhost<strong>;</strong>Database=appdb;trusted_connection=false;Persist Security Info=False;Encrypt=False\";</li></ul><p><br></p><p><strong><u>To Work with SQLServer:</u></strong></p><p>(Open a New Terminal) type the below commands</p><p><strong>sqlcmd -U sa&nbsp;</strong></p><p>password:&nbsp;<strong>examlyMssql@123</strong></p><p>1&gt; create database appdb</p><p>2&gt;go</p><p><br></p><p>1&gt;use appdb</p><p>2&gt;go</p><p><br></p><p>1&gt; create table TableName(columnName datatype,...)</p><p>2&gt; go</p><p>&nbsp;</p><p>1&gt; insert into TableName values(\" \",\" \",....)</p><p>2&gt; go</p><p><br></p><p><strong><u>Methods:</u></strong></p><p>Define the following methods inside the <strong>Program </strong>class, located in the <strong>Program.cs </strong>file.</p><h4><br></h4><h4>1. <strong>AddExhibition(Exhibition exhibition)</strong></h4><ul><li>Inserts a new exhibition into the Exhibition table in the database.</li><li><strong>Parameters</strong>: An Exhibition object containing the details of the exhibition to be added.</li><li><strong>Access Modifier</strong>: public</li><li><strong>Return Type</strong>: void</li><li><strong>Console Messages</strong>:</li><li class=\"ql-indent-1\">After insertion, the details of the newly added exhibition are displayed in the following format:</li><li class=\"ql-indent-2\">Exhibition added successfully with Title: {Title}</li><li class=\"ql-indent-2\">ExhibitionID: {ExhibitionID} Title: {Title} Venue: {Venue} Date: {Date} TicketPrice: {TicketPrice}</li></ul><p><br></p><h4>2. <strong>DisplayAllExhibitions()</strong></h4><ul><li>Retrieves and displays all exhibitions from the Exhibition table.</li><li><strong>Architecture</strong>: Uses a disconnected architecture with <strong>SqlDataAdapter, DataSet, and DataRow.</strong></li><li><strong>Access Modifier</strong>: public</li><li><strong>Declaration Modifier</strong>: static</li><li><strong>Return Type</strong>: void</li><li><strong>Console Messages</strong>:</li><li>If exhibitions are found, the details of each exhibition are displayed in the following format:</li><li class=\"ql-indent-1\">ExhibitionID: {ExhibitionID} Title: {Title} Venue: {Venue} Date: {Date} TicketPrice: {TicketPrice}</li><li>If no exhibitions are found: \"No exhibitions found.\"</li></ul><p><br></p><h4>3. <strong>UpdateExhibition(int exhibitionID, Exhibition exhibition)</strong></h4><ul><li>Updates the details of an existing exhibition based on ExhibitionID.</li><li><strong>Parameters</strong>:</li><li class=\"ql-indent-1\">exhibitionID: The ID of the exhibition to update.</li><li class=\"ql-indent-1\">exhibition: An Exhibition object containing the updated details.</li><li><strong>Access Modifier</strong>: public</li><li><strong>Return Type</strong>: void</li><li><strong>Console Messages</strong>:</li><li class=\"ql-indent-1\">If updated successfully:</li><li class=\"ql-indent-2\">Exhibition information updated successfully.</li><li class=\"ql-indent-1\">If no exhibition is found: \"No exhibition found with ID {exhibitionID}.\"</li></ul><h4><br></h4><h4>4. <strong>DeleteExhibition(int exhibitionID)</strong></h4><ul><li>Deletes an exhibition from the Exhibition table based on the provided ExhibitionID.</li><li><strong>Architecture</strong>: Uses a disconnected architecture with SqlConnection, DataSet, SqlCommand, and SqlCommandBuilder.</li><li><strong>Parameters</strong>: The ExhibitionID of the exhibition to delete.</li><li><strong>Access Modifier</strong>: public</li><li><strong>Declaration Modifier</strong>: static</li><li><strong>Return Type</strong>: void</li><li><strong>Console Messages</strong>:</li><li class=\"ql-indent-1\">If the exhibition is successfully deleted:</li><li class=\"ql-indent-2\">Exhibition deleted successfully.</li><li class=\"ql-indent-1\">If no exhibition is found with the given ExhibitionID: \"No exhibition found with ID {exhibitionID}.\"</li></ul><h4><br></h4><h3>Main Menu:</h3><p>The main menu serves as the user interface for interacting with the system. It provides the following options:</p><p><strong>Exhibition Management Menu - Enter your choice (1-5):</strong></p><ol><li>Add Exhibition</li><li>Delete Exhibition by ID</li><li>Update Exhibition Information</li><li>Display All Exhibitions</li><li>Exit - Terminates the application with the message \"Exiting the application...\".</li></ol><p><strong>Invalid choice</strong> - Displays \"Invalid choice.\" if the input does not match any menu options.</p><p><strong>Refer the sample output:</strong></p><p><br></p><p><strong>Add Exhibition:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-3\"></p><p><strong>Display Exhibition:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-4\"></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-5\"></p><p><strong>Update </strong><strong style=\"color: rgb(51, 51, 51);\">Exhibition:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-6\"></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-7\"></p><p><strong>Delete </strong><strong style=\"color: rgb(51, 51, 51);\">Exhibition:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-8\"></p><p><strong>Exit:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-9\"></p><p><strong>Invalid Choice:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-10\"></p>",
    //       "codeComponents": [],
    //       "aiAnalysis": "No solution is fetched",
    //       "Test_Submitted_Time": "2024-12-27 | 05:29:57 PM",
    //       "Differnce_In_Submission": "The difference is more than 5 minutes or not recorded on submission of test. Check manually for Latest Code",
    //       "log": [
    //           "[\n  \"    0 Error(s)\",\n  \"/home/coder/project/workspace/dotnetapp/Program.cs(41,42): error CS1003: Syntax error, ',' expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n  \"/home/coder/project/workspace/dotnetapp/Program.cs(41,42): error CS1003: Syntax error, ',' expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n  \"    1 Error(s)\"\n]"
    //       ],
    //       "TestCode": {}
    //   },
    //     {
    //         "key": "bbfaefdafbde322385741cbfcdecedbaabbfcfone",
    //         "test_Id": "",
    //         "name": "Abdul Mohamed Ibrahim Gani",
    //         "tcList": [
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CreateCustomer_ReturnsCreatedCustomer",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "GetCustomersSortedByName_ReturnsSortedCustomers",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CreateBooking_ReturnsCreatedBookingWithCustomerDetails",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "GetCustomerById_ReturnsCustomer",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "UpdateBooking_ReturnsNoContent",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "UpdateBooking_InvalidId_ReturnsNotFound",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "GetBookings_ReturnsListOfBookingsWithCustomers",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "GetCustomerById_InvalidId_ReturnsNotFound",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CustomerModel_HasAllProperties",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "BookingModel_HasAllProperties",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "DbContext_HasDbSetProperties",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CustomerBooking_Relationship_IsConfiguredCorrectly",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CreateBooking_ThrowsRoomNumberException_ForZeroOrNegativeRoomNumber",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "CreateBooking_ThrowsRoomNumberException_ForZeroRoomNumber",
    //                 "result": "Failure"
    //             }
    //         ],
    //         "QuestionData": "<h3><strong>HotelBookingManagement</strong></h3><p><br></p><p><strong>Problem Statement:</strong></p><p><strong>Develop a Web API project for HotelBookingManagement</strong> using <strong>ASP.NET Core</strong>. This API will manage customers and their room bookings with complete <strong>CRUD</strong> operations. The system should allow for customer creation, retrieval, updating, and deletion, as well as room booking creation and management. You will need to define models, controllers, and handle status codes correctly. Implement validation and exception handling for erroneous input, especially in cases of missing data or invalid booking dates or number of rooms.</p><p><br></p><p>Your task is to implement the API based on the following requirements.</p><p><br></p><p><strong>Models:</strong></p><p> </p><ol><li><strong>Customer.cs:</strong></li></ol><ul><li class=\"ql-indent-1\"><strong>CustomerId (int): </strong>Represents the unique identifier for each customer. It is the primary key and is auto generated.</li><li class=\"ql-indent-1\"><strong>Name (string): </strong>The name of the customer. This field is required.</li><li class=\"ql-indent-1\"><strong>Email (string): </strong>The email address of the customer. This field is required and must be in a valid email format.</li><li class=\"ql-indent-1\"><strong>PhoneNumber (string): </strong>The phone number of the customer. This field is required.</li><li class=\"ql-indent-1\"><strong>Bookings (ICollection&lt;Booking&gt;?): </strong>A collection of booking entities associated with the customer. This establishes a one-to-many relationship where one customer can have multiple bookings. The [JsonIgnore] attribute is applied to this property, indicating that it should be excluded from JSON serialization.</li></ul><p><br></p><p>\t\t2.<strong>Booking.cs:</strong></p><ul><li class=\"ql-indent-1\"><strong>BookingId (int): </strong>Represents the unique identifier for each booking. It is the primary key and is auto-generated.</li><li class=\"ql-indent-1\"><strong>BookingDate (string): </strong>Represents the date when the booking was made. This field must be in a valid date format.</li><li class=\"ql-indent-1\"><strong>NumberOfRooms (int): </strong>Represents the number of rooms booked. This field must be greater than zero.</li><li class=\"ql-indent-1\"><strong>CustomerId (int):</strong> Represents the foreign key linking to the Customer entity. This establishes a many-to-one relationship where multiple bookings can be associated with a single customer.</li><li class=\"ql-indent-1\"><strong>Customer (Customer):</strong> A reference to the Customer entity associated with the booking. This navigation property links the booking to the customer who made the booking. It is optional.</li></ul><p><br></p><p>Using <strong>ApplicationDbContext</strong> for <strong>Customer</strong> and <strong>Booking</strong> system. <strong>ApplicationDbContext</strong> must be present inside the <strong>Data </strong>folder. </p><p><br></p><ul><li><strong>Namespace - dotnetapp.Data</strong></li></ul><p><br></p><p>The <strong>ApplicationDbContext</strong> class acts as the primary interface between the application and the database, managing CRUD (Create, Read, Update) operations for <strong>Customer</strong> entities and (Create, Read, Update, Delete) operations for <strong>Booking</strong> entities. This context class defines the database schema through its DbSet properties and manages the <strong>one-to-many relationship </strong>between <strong>Customer</strong> and <strong>Booking</strong> entities using the Fluent API.</p><p><br></p><p><strong>DbSet Properties:</strong></p><p><br></p><p><strong>1.DbSet&lt;Customer&gt; Customers:</strong> </p><p>Represents the <strong>Customers</strong> table in the database, where each customer can have multiple associated <strong>Booking</strong> entries. This defines the <strong>one-to-many relationship</strong> between Customer and Booking (i.e., one customer can make many bookings).</p><p><br></p><p><strong>2.DbSet&lt;Booking&gt; Bookings: </strong></p><p>Represents the <strong>Bookings</strong> table in the database. Each <strong>Booking</strong> is associated with a single <strong>Customer</strong>, establishing the <strong>many-to-one relationship</strong> between Booking and Customer using the CustomerId foreign key.</p><p><br></p><p><strong>Implement the actual logic in the controller:</strong></p><p><strong>Controllers: Namespace: dotnetapp.Controllers</strong></p><p><br></p><p><strong>BookingController</strong></p><p><br></p><ul><li><strong>GetBookings():</strong> Retrieves a list of all bookings, including their associated customer information using eager loading (Include(r =&gt; r.Customer)). If no bookings are found, it returns a<strong> 204 No Content</strong> instead of an empty list. If bookings are found, it returns a <strong>200 OK </strong>response with a list of bookings and their associated customer details.</li></ul><p><br></p><ul><li><strong>CreateBooking([FromBody] Booking bookings): </strong>Adds a new booking to the database. If the booking object is null, it returns a <strong>400 Bad Request </strong>with an error message. Additionally, if the <strong>NumberOfRooms</strong> is less than or equal to zero, it throws a custom <strong>RoomNumberException</strong> with <strong>status code 500</strong>. Upon successful creation, it returns a <strong>201 Created</strong> response with the newly created booking.</li></ul><p><br></p><ul><li><strong>UpdateBooking(int id, [FromBody] Booking booking): </strong>Updates the booking identified by id. If the id does not match the BookingId of the provided booking object, it returns a <strong>400 Bad Request. </strong>If the booking with the specified id is not found, it returns a<strong> 404 Not Found.</strong> Upon a successful update, it returns a <strong>204 No Content.</strong></li></ul><p><br></p><p><strong style=\"color: rgb(72, 72, 72);\">CustomerController</strong></p><p><br></p><ul><li><strong>CreateCustomer([FromBody] Customer customer): </strong>Adds a new customer to the database. Upon successful creation, it returns a <strong>201 Created </strong>response with the newly created customer.</li></ul><p><br></p><ul><li><strong>GetCustomersSortedByName(): </strong>Retrieves and sorts customers by their name in ascending order. It eagerly loads their associated booking using eager loading (Include(c =&gt; c.Bookings)), returning a 200 OK with the sorted customer list.</li></ul><p><br></p><ul><li><strong>GetCustomer(int id):</strong> Retrieves a single customer by their <strong>CustomerId</strong>, along with their associated bookings using eager loading (Include(c =&gt; c.Bookings)). If the customer is not found, it returns a <strong>404 Not Found.</strong> Otherwise, it returns a <strong>200 OK </strong>response with the customer details and their related bookings.</li></ul><p><br></p><p><strong>Exceptions:</strong></p><ul><li><strong>RoomNumberException</strong> is a custom exception located in the <strong>dotnetapp.Exceptions folder. </strong></li><li>It is thrown when the <strong>NumberOfRooms</strong> in a booking is less than or equal to 0. The exception provides the following message when triggered: \"<strong>Number of rooms must be greater than 0.</strong>\"</li></ul><p><br></p><p><strong>Endpoints:</strong></p><p><strong>Bookings:</strong></p><p><strong>GET /api/Booking: </strong>Retrieve a list of all bookings, including their associated customer information.</p><p><strong>POST /api/Booking: </strong>Create a new booking. Requires a <strong>CustomerId</strong> and valid <strong>NumberOfRooms</strong>.</p><p><strong>PUT /api/Booking/{id}:</strong> Update a booking by its ID.</p><p><br></p><p><strong>Customers:</strong></p><p><strong>POST /api/Customer: </strong>Create a new customer.</p><p><strong>GET /api/Customer/SortedByName: </strong>Retrieve and sort customers by name in ascending order.</p><p><strong>GET /api/Customer/{id}:</strong> Retrieve a specific customer by their ID, including their associated bookings.</p><p><br></p><p><strong>Status Codes and Error Handling:</strong></p><p><strong>204 No Content:</strong> Returned when no records are found for booking or customers.</p><p><strong>200 OK:</strong> Returned when records are successfully retrieved.</p><p><strong>201 Created:</strong> Returned when a new booking or customer is successfully created.</p><p><strong>400 Bad Request: </strong>Returned when there are validation errors or mismatched IDs during updates.</p><p><strong>404 Not Found:</strong> Returned when a booking or customer is not found during retrieval or deletion.</p><p><strong>RoomNumberException:</strong> Thrown when the <strong>NumberOfRooms</strong> in a booking is less than or equal to 0, with the message: \"<strong>Number of rooms must be greater than 0.</strong>\" This exception should return a <strong>status code of 500</strong>.</p><p><br></p><p><strong><u>Note:</u></strong></p><ul><li>Use swagger/index to view the API output screen in 8080 port.</li><li>Don't delete any files in the project environment.</li><li>When clicking on Run Testcase button make sure that your application is running on the port 8080.</li></ul><p><br></p><p><strong>Commands to Run the Project:</strong></p><ul><li><strong>cd dotnetapp</strong></li></ul><p>Select the dotnet project folder</p><ul><li><strong>dotnet restore</strong></li></ul><p>This command will restore all the required packages to run the application.</p><ul><li><strong>dotnet run</strong></li></ul><p>To run the application in port 8080 (The settings preloaded click 8080 Port to View)</p><ul><li><strong>dotnet build</strong></li></ul><p>To build and check for errors</p><ul><li><strong>dotnet clean</strong></li></ul><p>If the same error persists clean the project and build again</p><p><br></p><p><br></p><p><strong>For Entity Framework Core:</strong></p><p>To use</p><p>Entity Framework :</p><p>Install EF:</p><ul><li><strong>dotnet new tool-manifest</strong></li><li><strong>dotnet tool install --local dotnet-ef --version 6.0.6</strong></li></ul><p>\t\t\t--Then use dotnet dotnet-ef instead of dotnet-ef.</p><ul><li><strong>dotnet dotnet-ef</strong></li></ul><p>\t\t\t--To check the EF installed or not.</p><ul><li><strong>dotnet dotnet-ef migrations add initialsetup</strong> </li></ul><p>\t\t\tThis command is to add migrations</p><ul><li><strong>dotnet dotnet-ef database update </strong></li></ul><p>\t\t\tThis command is to update the database.</p><p><br></p><p><strong>Note:</strong></p><p>Use the below sample connection string to connect the MsSql Server</p><p>&nbsp;private string <strong>connectionString </strong>= \"User ID=sa;password=examlyMssql@123; server=localhost;Database=appdb;trusted_connection=false;Persist Security Info=False;Encrypt=False\"</p>",
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
    //                                 "name": "BookingController.cs",
    //                                 "code": "using Microsoft.AspNetCore.Mvc;\nusing Microsoft.EntityFrameworkCore;\nusing dotnetapp.Models;\nusing dotnetapp.Data;\nusing dotnetapp.Exceptions;\nusing System.Threading.Tasks;\n\nnamespace dotnetapp.Controllers\n{\n    public class BookingController : Controller\n    {\n        private ApplicationDbContext _context;\n        public BookingController(ApplicationDbContext context)\n        {\n            _context = context;\n        }\n\n        [HttpGet(\"/api/Booking\")]\n        public async Task&lt;ActionResult&gt; GetBookings()\n        {\n            if(_context.Bookings.Count() == 0)\n            {\n                return NoContent();\n            }\n            var boo = _context.Bookings.Include(r=&gt;r.Customer).ToList();\n            return Ok(boo);\n        }\n\n    //    [HttpPost(\"/api/Booking\")]\n    //    public async Task&lt;ActionResult&gt; \n\n        \n    }\n\n}\n"
    //                             },
    //                             {
    //                                 "type": "file",
    //                                 "name": "CustomerController.cs",
    //                                 "code": "using Microsoft.AspNetCore.Mvc;\nusing Microsoft.EntityFrameworkCore;\nusing dotnetapp.Models;\nusing dotnetapp.Data;\nusing dotnetapp.Exceptions;\nusing System.Threading.Tasks;\n\nnamespace dotnetapp.Controllers\n{\n    public class CustomerController : Controller\n    {\n        private ApplicationDbContext _context;\n        public CustomerController(ApplicationDbContext context)\n        {\n            _context = context;\n        }\n\n        [HttpGet(\"/api/Customer\")]\n        public async Task&lt;ActionResult&gt; GetCustomer(int id)\n        {\n\n            return NotFound();\n        //    var emp = _context.Customers.FirstOrDefault(d=&gt;d.CustomerId==id);\n        //    if(emp == null)\n        //    {\n        //     return NotFound();\n        //    }\n        //    return Ok(emp);\n        }\n\n        [HttpPost(\"/api/Customer\")]\n       public async Task&lt;ActionResult&gt; CreateCustomer([FromBody] Customer customer)\n       {\n        if(!ModelState.IsValid)\n        {\n            return BadRequest();\n        }\n        _context.Customers.Add(customer);\n        await _context.SaveChangesAsync();\n        return CreatedAtAction(nameof(CreateCustomer), new {id=customer.CustomerId},customer);\n       }\n\n       [HttpGet(\"/api/Customer/SortedByName\")]\n       public async Task&lt;ActionResult&gt; GetCustomerSortedByName()\n       {\n        //   if(_context.Customers.Count() == 0)\n        //   {\n        //     return NoContent();\n        //   }\n\n          var todo = _context.Customers.Include(c=&gt;c.Bookings).OrderBy(o=&gt;o.Name).ToList();\n          return Ok(todo);\n       }\n    }\n\n}\n"
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
    //                                 "code": "\nusing dotnetapp.Models;\nusing Microsoft.EntityFrameworkCore;\nnamespace dotnetapp.Data\n{\n    public class ApplicationDbContext : DbContext\n    {\n        public ApplicationDbContext(DbContextOptions&lt;ApplicationDbContext&gt; options)\n            : base(options)\n        {\n        }\n\n        public virtual DbSet&lt;Customer&gt;Customers {get;set;}\n        public virtual DbSet&lt;Booking&gt;Bookings {get;set;}\n\n        // Represent the Customers table\n        // Represent the Bookings table\n\n        protected override void OnModelCreating(ModelBuilder modelBuilder)\n        {\n            // Configuring the one-to-many relationship between Customer and Booking\n             \n\n            modelBuilder.Entity&lt;Customer&gt;()\n            .HasMany&lt;Booking&gt;(b=&gt;b.Bookings)\n            .WithOne(c=&gt;c.Customer)\n            .HasForeignKey(c=&gt;c.CustomerId);\n\n        }\n    }\n}\n"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "directory",
    //                         "name": "Exceptions",
    //                         "contents": [
    //                             {
    //                                 "type": "file",
    //                                 "name": "RoomNumberException.cs",
    //                                 "code": "using System;\n\n\nnamespace dotnetapp.Exceptions\n{\n    public class RoomNumberException : Exception\n    {\n        public RoomNumberException (string message) : base(message)\n        {\n\n        }\n    }\n\n}"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "directory",
    //                         "name": "Models",
    //                         "contents": [
    //                             {
    //                                 "type": "file",
    //                                 "name": "Booking.cs",
    //                                 "code": "using System.ComponentModel.DataAnnotations;\nusing System.ComponentModel.DataAnnotations.Schema;\nusing System.Text.Json.Serialization;\n\nnamespace dotnetapp.Models\n{\n   public class Booking\n   {\n    [Key]\n    public int BookingId {get;set;}\n\n    \n    public string BookingDate {get;set;}\n\n    //[Range(NumberOfRooms&gt;0)]\n    public int NumberOfRooms {get;set;}\n\n    public int CustomerId {get;set;}\n\n    [ForeignKey(\"CustomerId\")]\n    \n    [JsonIgnore]\n    public virtual Customer? Customer {get;set;}\n   }\n\n\n}\n"
    //                             },
    //                             {
    //                                 "type": "file",
    //                                 "name": "Customer.cs",
    //                                 "code": "using System.ComponentModel.DataAnnotations;\nusing System.ComponentModel.DataAnnotations.Schema;\nusing System.Text.Json.Serialization;\nusing System.Collections;\n\nnamespace dotnetapp.Models\n{\n    public class Customer \n    {\n        [Key]\n        public int CustomerId {get;set;}\n        \n        [Required]\n        public string Name {get;set;}\n\n\n        [Required]\n        [EmailAddress]\n        public string Email {get;set;}\n\n        [Required]\n        public string PhoneNumber {get;set;}\n\n        [JsonIgnore]\n        public virtual ICollection&lt;Booking&gt;? Bookings {get;set;}\n    }\n    \n}\n"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "file",
    //                         "name": "Program.cs",
    //                         "code": "using dotnetapp.Models;\nusing dotnetapp.Data;\nusing Microsoft.EntityFrameworkCore;\nusing dotnetapp.Exceptions;\n\n\nvar builder = WebApplication.CreateBuilder(args);\n\n// Add services to the container.\n\nbuilder.Services.AddControllers();\n// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle\nbuilder.Services.AddEndpointsApiExplorer();\nbuilder.Services.AddSwaggerGen();\nbuilder.Services.AddDbContext&lt;ApplicationDbContext&gt;(options=&gt;options.UseSqlServer(builder.Configuration.GetConnectionString(\"Conn\")));\n\nvar app = builder.Build();\n\n// Configure the HTTP request pipeline.\nif (app.Environment.IsDevelopment())\n{\n    app.UseSwagger();\n    app.UseSwaggerUI();\n}\n\napp.UseHttpsRedirection();\n\napp.UseAuthorization();\n\napp.MapControllers();\n\napp.Run();\n"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "type": "directory",
    //                 "name": "TestProject",
    //                 "contents": []
    //             }
    //         ],
    //         "aiAnalysis": "The solution provided has several issues that are causing the tests to fail. \n\nIn the `BookingController`, the `CreateBooking` action is missing, which is causing the tests to expect a `MethodNotAllowed` status code. \n\nIn the `CustomerController`, the `GetCustomer` action is not implemented correctly, which is causing the tests to expect a `NotFound` status code. \n\nIn the `ApplicationDbContext`, the `OnModelCreating` method is missing the configuration for the `Booking` table, which is causing the relationship between `Customer` and `Booking` to be missing. \n\nThe `RoomNumberException` is not thrown in the `CreateBooking` action when the `NumberOfRooms` is less than or equal to 0, which is causing the tests to expect an `InternalServerError` status code.\n\nFinal Analysis: The solution has several logical and implementation issues, including missing actions, incorrect implementation of actions, and missing configuration for the database context. The solution needs to be refactored to fix these issues and make it functional.",
    //         "Test_Submitted_Time": "2025-01-17 | 04:41:55 PM",
    //         "SonarAddedTime": "2025-01-17 | 04:40:37 PM",
    //         "Differnce_In_Submission": "1.30 mins",
    //         "log": [
    //             "{\n  \"passed\": [\n    \"BookingModel_HasAllProperties\",\n    \"CustomerBooking_Relationship_IsConfiguredCorrectly\",\n    \"CustomerModel_HasAllProperties\",\n    \"DbContext_HasDbSetProperties\",\n    \"GetCustomerById_InvalidId_ReturnsNotFound\",\n    \"UpdateBooking_InvalidId_ReturnsNotFound\"\n  ],\n  \"failed\": [\n    {\n      \"testName\": \"CreateBooking_ReturnsCreatedBookingWithCustomerDetails\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Response status code does not indicate success: 500 (Internal Server Error).\"\n    },\n    {\n      \"testName\": \"CreateBooking_ThrowsRoomNumberException_ForZeroOrNegativeRoomNumber\",\n      \"errorMessage\": \"Expected: InternalServerError\\r\\n  But was:  MethodNotAllowed\"\n    },\n    {\n      \"testName\": \"CreateBooking_ThrowsRoomNumberException_ForZeroRoomNumber\",\n      \"errorMessage\": \"Expected: InternalServerError\\r\\n  But was:  MethodNotAllowed\"\n    },\n    {\n      \"testName\": \"CreateCustomer_ReturnsCreatedCustomer\",\n      \"errorMessage\": \"Expected: Created\\r\\n  But was:  InternalServerError\"\n    },\n    {\n      \"testName\": \"GetBookings_ReturnsListOfBookingsWithCustomers\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Response status code does not indicate success: 500 (Internal Server Error).\"\n    },\n    {\n      \"testName\": \"GetCustomerById_ReturnsCustomer\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Response status code does not indicate success: 500 (Internal Server Error).\"\n    },\n    {\n      \"testName\": \"GetCustomersSortedByName_ReturnsSortedCustomers\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Response status code does not indicate success: 500 (Internal Server Error).\"\n    },\n    {\n      \"testName\": \"UpdateBooking_ReturnsNoContent\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Response status code does not indicate success: 500 (Internal Server Error).\"\n    }\n  ]\n}"
    //         ],
    //         "TestCode": {
    //             "UnitTest1.cs": "using NUnit.Framework;\nusing System.Net;\nusing System.Text;\nusing System.Threading.Tasks;\nusing Microsoft.EntityFrameworkCore;\nusing dotnetapp.Data;\nusing dotnetapp.Models;\nusing System;\nusing System.Net.Http;\nusing System.Text;\nusing System.Threading.Tasks;\nusing Newtonsoft.Json;\nusing dotnetapp.Exceptions;\nusing System.Buffers;\n\n\nnamespace dotnetapp.Tests\n{\n    [TestFixture]\n    public class HotelControllerTests\n    {\n        private DbContextOptions&lt;ApplicationDbContext&gt; _dbContextOptions;\n        private ApplicationDbContext _context;\n        private HttpClient _httpClient;\n\n        [SetUp]\n        public void Setup()\n        {\n            _httpClient = new HttpClient();\n            _httpClient.BaseAddress = new Uri(\"http://localhost:8080\"); // Base URL of your API\n            _dbContextOptions = new DbContextOptionsBuilder&lt;ApplicationDbContext&gt;()\n                .UseInMemoryDatabase(databaseName: \"TestDatabase\")\n                .Options;\n\n            _context = new ApplicationDbContext(_dbContextOptions);\n        }\n\n       private async Task&lt;int&gt; CreateTestCustomerAndGetId()\n        {\n            var newCustomer = new Customer\n            {\n                Name = \"Test Customer\",\n                Email = \"test@example.com\",\n                PhoneNumber = \"9876543210\"\n            };\n\n            var json = JsonConvert.SerializeObject(newCustomer);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            var response = await _httpClient.PostAsync(\"api/Customer\", content);\n            response.EnsureSuccessStatusCode();\n\n            var createdCustomer = JsonConvert.DeserializeObject&lt;Customer&gt;(await response.Content.ReadAsStringAsync());\n            return createdCustomer.CustomerId;\n        }\n\n\n       [Test]\n        public async Task CreateCustomer_ReturnsCreatedCustomer()\n        {\n            // Arrange\n            var newCustomer = new Customer\n            {\n                Name = \"Test Customer\",\n                Email = \"test@example.com\",\n                PhoneNumber = \"9876543210\"\n            };\n\n            var json = JsonConvert.SerializeObject(newCustomer);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Customer\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            var createdCustomer = JsonConvert.DeserializeObject&lt;Customer&gt;(responseContent);\n\n            Assert.IsNotNull(createdCustomer);\n            Assert.AreEqual(newCustomer.Name, createdCustomer.Name);\n            Assert.AreEqual(newCustomer.Email, createdCustomer.Email);\n            Assert.AreEqual(newCustomer.PhoneNumber, createdCustomer.PhoneNumber);\n\n            var locationHeader = response.Headers.Location.ToString();\n            Assert.IsTrue(locationHeader.Contains(createdCustomer.CustomerId.ToString()));\n\n            // Optionally, verify the data by fetching it again\n            var fetchedResponse = await _httpClient.GetAsync(locationHeader);\n            Assert.AreEqual(HttpStatusCode.OK, fetchedResponse.StatusCode);\n            var fetchedContent = await fetchedResponse.Content.ReadAsStringAsync();\n            var fetchedCustomer = JsonConvert.DeserializeObject&lt;Customer&gt;(fetchedContent);\n\n            Assert.IsNotNull(fetchedCustomer);\n            Assert.AreEqual(createdCustomer.CustomerId, fetchedCustomer.CustomerId);\n        }\n\n\n       [Test]\n        public async Task GetCustomersSortedByName_ReturnsSortedCustomers()\n        {\n            // Act\n            var response = await _httpClient.GetAsync(\"api/Customer/SortedByName\");\n\n            // Assert\n            response.EnsureSuccessStatusCode();\n            var customers = JsonConvert.DeserializeObject&lt;Customer[]&gt;(await response.Content.ReadAsStringAsync());\n            Assert.IsNotNull(customers);\n            Assert.AreEqual(customers.OrderBy(c =&gt; c.Name).ToList(), customers);\n        }\n\n        [Test]\n        public async Task CreateBooking_ReturnsCreatedBookingWithCustomerDetails()\n        {\n            // Arrange\n            int customerId = await CreateTestCustomerAndGetId(); // Dynamically create a valid Customer\n\n            var newBooking = new Booking\n            {\n                BookingDate = \"2024-05-15\",\n                NumberOfRooms = 4,\n                CustomerId = customerId\n            };\n\n            var json = JsonConvert.SerializeObject(newBooking);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Booking\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            var createdBooking = JsonConvert.DeserializeObject&lt;Booking&gt;(responseContent);\n\n            Assert.IsNotNull(createdBooking);\n            Assert.AreEqual(newBooking.BookingDate, createdBooking.BookingDate);\n            Assert.AreEqual(newBooking.NumberOfRooms, createdBooking.NumberOfRooms);\n        }\n\n      [Test]\n        public async Task GetCustomerById_ReturnsCustomer()\n        {\n            // Arrange\n            int customerId = await CreateTestCustomerAndGetId(); // Create a customer and get its ID\n\n            // Act: Get the customer by ID and verify the response\n            var response = await _httpClient.GetAsync($\"api/Customer/{customerId}\");\n            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode); // Check if the response is OK\n\n            // Deserialize the customer object from the response\n            var customer = JsonConvert.DeserializeObject&lt;Customer&gt;(await response.Content.ReadAsStringAsync());\n\n            // Assert: Customer object should not be null\n            Assert.IsNotNull(customer);\n        }\n\n\n\n        [Test]\n        public async Task UpdateBooking_ReturnsNoContent()\n        {\n            // Arrange\n            int customerId = await CreateTestCustomerAndGetId();\n            var newBooking = new Booking\n            {\n                BookingDate = \"2024-06-25\",\n                NumberOfRooms = 4,\n                CustomerId = customerId\n            };\n\n            var json = JsonConvert.SerializeObject(newBooking);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            var response = await _httpClient.PostAsync(\"api/Booking\", content);\n            var createdBooking = JsonConvert.DeserializeObject&lt;Booking&gt;(await response.Content.ReadAsStringAsync());\n\n            var updatedBooking = new Booking\n            {\n                BookingId = createdBooking.BookingId,\n                BookingDate = DateTime.UtcNow.AddDays(1).ToString(\"yyyy-MM-dd\"),\n                NumberOfRooms = 6,\n                CustomerId = customerId\n            };\n\n            var updateJson = JsonConvert.SerializeObject(updatedBooking);\n            var updateContent = new StringContent(updateJson, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var updateResponse = await _httpClient.PutAsync($\"api/Booking/{createdBooking.BookingId}\", updateContent);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.NoContent, updateResponse.StatusCode);\n        }\n\n        [Test]\n        public async Task UpdateBooking_InvalidId_ReturnsNotFound()\n        {\n            // Arrange\n            var updatedBooking = new Booking\n            {\n                BookingId = 9999, // Non-existent ID\n                BookingDate = DateTime.UtcNow.ToString(\"yyyy-MM-dd\"),\n                NumberOfRooms = 6,\n            };\n\n            var json = JsonConvert.SerializeObject(updatedBooking);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PutAsync($\"api/Booking/{updatedBooking.BookingId}\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);\n        }\n\n\n        [Test]\n        public async Task GetBookings_ReturnsListOfBookingsWithCustomers()\n        {\n            // Act\n            var response = await _httpClient.GetAsync(\"api/Booking\");\n\n            // Assert\n            response.EnsureSuccessStatusCode();\n            var bookings = JsonConvert.DeserializeObject&lt;Booking[]&gt;(await response.Content.ReadAsStringAsync());\n\n            Assert.IsNotNull(bookings);\n            Assert.IsTrue(bookings.Length &gt; 0);\n            Assert.IsNotNull(bookings[0].Customer); // Ensure each booking has a customer loaded\n        }\n\n        [Test]\n        public async Task GetCustomerById_InvalidId_ReturnsNotFound()\n        {\n            // Act\n            var response = await _httpClient.GetAsync(\"api/Customer/999\");\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);\n        }\n\n\n\n        [Test]\n        public void CustomerModel_HasAllProperties()\n        {\n            // Arrange\n            var customer = new Customer\n            {\n                CustomerId = 5,\n                Name = \"Jane Doe\",\n                Email = \"jane.doe@example.com\",\n                PhoneNumber = \"9876543210\",\n                Bookings = new List&lt;Booking&gt;() // Ensure the Bookings collection is properly initialized\n            };\n\n            // Act &amp; Assert\n            Assert.AreEqual(5, customer.CustomerId, \"CustomerId does not match.\");\n            Assert.AreEqual(\"Jane Doe\", customer.Name, \"Name does not match.\");\n            Assert.AreEqual(\"jane.doe@example.com\", customer.Email, \"Email does not match.\");\n            Assert.AreEqual(\"9876543210\", customer.PhoneNumber, \"PhoneNumber does not match.\");\n            Assert.IsNotNull(customer.Bookings, \"Bookings collection should not be null.\");\n            Assert.IsInstanceOf&lt;ICollection&lt;Booking&gt;&gt;(customer.Bookings, \"Bookings should be of type ICollection&lt;Booking&gt;.\");\n        }\n\n\n        [Test]\n        public void BookingModel_HasAllProperties()\n        {\n            // Arrange\n            var customer = new Customer\n            {\n                CustomerId = 5,\n                Name = \"Jane Doe\",\n                Email = \"jane.doe@example.com\",\n                PhoneNumber = \"9876543210\"\n            };\n\n            var booking = new Booking\n            {\n                BookingId = 100,\n                BookingDate = \"2024-09-12\",\n                NumberOfRooms = 6,\n                CustomerId = 5,\n                Customer = customer\n            };\n\n            // Act &amp; Assert\n            Assert.AreEqual(100, booking.BookingId, \"BookingId does not match.\");\n            Assert.AreEqual(\"2024-09-12\", booking.BookingDate, \"BookingDate does not match.\");\n            Assert.AreEqual(6, booking.NumberOfRooms, \"NumberOfRooms does not match.\");\n            Assert.AreEqual(5, booking.CustomerId, \"CustomerId does not match.\");\n            Assert.IsNotNull(booking.Customer, \"Customer should not be null.\");\n            Assert.AreEqual(customer.Name, booking.Customer.Name, \"Customer's Name does not match.\");\n        }\n\n\n        [Test]\n        public void DbContext_HasDbSetProperties()\n        {\n            // Assert that the context has DbSet properties for Customers and Bookings\n            Assert.IsNotNull(_context.Customers, \"Customers DbSet is not initialized.\");\n            Assert.IsNotNull(_context.Bookings, \"Bookings DbSet is not initialized.\");\n        }\n\n\n        [Test]\n        public void CustomerBooking_Relationship_IsConfiguredCorrectly()\n        {\n            // Check if the Customer to Booking relationship is configured as one-to-many\n            var model = _context.Model;\n            var customerEntity = model.FindEntityType(typeof(Customer));\n            var bookingEntity = model.FindEntityType(typeof(Booking));\n\n            // Assert that the foreign key relationship exists between Booking and Customer\n            var foreignKey = bookingEntity.GetForeignKeys().FirstOrDefault(fk =&gt; fk.PrincipalEntityType == customerEntity);\n\n            Assert.IsNotNull(foreignKey, \"Foreign key relationship between Booking and Customer is not configured.\");\n            Assert.AreEqual(\"CustomerId\", foreignKey.Properties.First().Name, \"Foreign key property name is incorrect.\");\n\n            // Check if the cascade delete behavior is set\n            Assert.AreEqual(DeleteBehavior.Cascade, foreignKey.DeleteBehavior, \"Cascade delete behavior is not set correctly.\");\n        }\n\n\n        [Test]\n        public async Task CreateBooking_ThrowsRoomNumberException_ForZeroOrNegativeRoomNumber()\n        {\n            // Arrange\n            var newBooking = new Booking\n            {\n                BookingDate = DateTime.UtcNow.ToString(\"yyyy-MM-dd\"),\n                NumberOfRooms = -6,\n                CustomerId = 5\n            };\n\n            var json = JsonConvert.SerializeObject(newBooking);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Booking\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.InternalServerError, response.StatusCode); // 500 for thrown exception\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            Assert.IsTrue(responseContent.Contains(\"Number of rooms must be greater than 0.\"), \"Expected error message not found in the response.\");\n        }\n\n        [Test]\n        public async Task CreateBooking_ThrowsRoomNumberException_ForZeroRoomNumber()\n        {\n            // Arrange\n            var newBooking = new Booking\n            {\n                BookingDate = DateTime.UtcNow.ToString(\"yyyy-MM-dd\"),\n                NumberOfRooms = 0,  // Invalid zero number of rooms\n                CustomerId = 5\n            };\n\n            var json = JsonConvert.SerializeObject(newBooking);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Booking\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.InternalServerError, response.StatusCode); // 500 for thrown exception\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            Assert.IsTrue(responseContent.Contains(\"Number of rooms must be greater than 0.\"), \"Expected error message not found in the response.\");\n        }\n\n\n        [TearDown]\n        public void Cleanup()\n        {\n            _httpClient.Dispose();\n        }\n    }\n}"
    //         }
    //     },
    //     {
    //         "key": "edcccdaacadcbadafbc321866160fdacdaone",
    //         "test_Id": "https://admin.ltimindtree.iamneo.ai/result?testId=U2FsdGVkX1%2BfegZdPVFRoXMGdfB%2BLfqWdBJxF2fOdmPY5shVtoMhCcBVTRg%2FH3L8A36NAxoHpY79P%2FRPfFbqiu6qKeQzpWP%2BOL18YudJBjty7HI9SbPgu2GWgnPPcWn8Eb6KYNZ7S8OTcVihSZxiPQ%3D%3D",
    //         "name": "Saloni Smriti",
    //         "tcList": [
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_Exhibition_Class_Should_Exist",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_Exhibition_Properties_Should_Exist",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_AddExhibition_Method_Exists",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_DisplayAllExhibitions_Method_Exists",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_DeleteExhibition_Method_Exists",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_UpdateExhibition_Method_Exists",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_AddExhibition_Should_Insert_Exhibition_Into_Database",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_DisplayAllExhibitions_Should_Output_All_Exhibitions",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_DisplayAllExhibitions_Should_Handle_No_Exhibitions_Found",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_DeleteExhibition_Should_Remove_Exhibition_From_Database",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_DeleteExhibition_Should_Handle_NonExistent_Exhibition",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_UpdateExhibition_Should_Update_Exhibition_Info_In_Database",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_UpdateExhibition_Should_Handle_NonExistent_Exhibition",
    //                 "result": "Compilation Error"
    //             }
    //         ],
    //         "QuestionData": "<p><strong>Exhibition Management System</strong></p><p><strong>Objective:</strong></p><p>Create the <strong>Exhibition </strong>table in the <strong>appdb</strong> database with columns for exhibition details. Develop a console-based C# application using ADO.NET to perform Create, Read, Update, and Delete operations on the Exhibition table in a SQL Server database. The application should enable users to add new exhibitions, display all exhibitions, update exhibition information, and delete exhibitions. Implement a combination of connected and disconnected architectures using SqlConnection, SqlCommand, and SqlDataAdapter. All classes, properties, and methods should be public.</p><p><br></p><p><strong>Folder Structure:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-1\"></p><p><br></p><p><strong>Table: </strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-2\"></p><h4><br></h4><p><strong>Classes and Properties:</strong></p><h4><strong style=\"color: rgb(51, 51, 51);\">Exhibition </strong><strong>Class (Models/</strong><strong style=\"color: rgb(51, 51, 51);\">Exhibition </strong><strong>.cs):</strong></h4><p>The <strong>Exhibition </strong>class represents a exhibition entity with the following <strong>public </strong>properties:</p><p><strong>Properties</strong>:</p><ul><li><strong>ExhibitionID </strong>(int): Unique identifier for each exhibition. Auto-incremented in the database.</li><li><strong>Title </strong>(string): The title of the exhibition.</li><li><strong>Venue </strong>(string): The venue where the exhibition will take place.</li><li><strong>Date </strong>(string): The date of the exhibition in \"yyyy-mm-dd\" format.</li><li><strong>TicketPrice </strong>(decimal): The price of the ticket for the exhibition.</li></ul><p><br></p><p><strong>Database Details:</strong></p><ul><li>Database Name: <strong>appdb</strong></li><li>Table Name: <strong style=\"color: rgb(51, 51, 51);\">Exhibition </strong></li><li>Ensure that the database connection is properly established using the <strong>ConnectionStringProvider</strong> class in the file <strong>Program.cs.</strong></li><li>Use the below connection string to connect the MsSql Server</li><li class=\"ql-indent-1\">public static string <strong>ConnectionString </strong>{ get; } = \"User ID=sa;password=examlyMssql@123; server=localhost<strong>;</strong>Database=appdb;trusted_connection=false;Persist Security Info=False;Encrypt=False\";</li></ul><p><br></p><p><strong><u>To Work with SQLServer:</u></strong></p><p>(Open a New Terminal) type the below commands</p><p><strong>sqlcmd -U sa&nbsp;</strong></p><p>password:&nbsp;<strong>examlyMssql@123</strong></p><p>1&gt; create database appdb</p><p>2&gt;go</p><p><br></p><p>1&gt;use appdb</p><p>2&gt;go</p><p><br></p><p>1&gt; create table TableName(columnName datatype,...)</p><p>2&gt; go</p><p>&nbsp;</p><p>1&gt; insert into TableName values(\" \",\" \",....)</p><p>2&gt; go</p><p><br></p><p><strong><u>Methods:</u></strong></p><p>Define the following methods inside the <strong>Program </strong>class, located in the <strong>Program.cs </strong>file.</p><h4><br></h4><h4>1. <strong>AddExhibition(Exhibition exhibition)</strong></h4><ul><li>Inserts a new exhibition into the Exhibition table in the database.</li><li><strong>Parameters</strong>: An Exhibition object containing the details of the exhibition to be added.</li><li><strong>Access Modifier</strong>: public</li><li><strong>Return Type</strong>: void</li><li><strong>Console Messages</strong>:</li><li class=\"ql-indent-1\">After insertion, the details of the newly added exhibition are displayed in the following format:</li><li class=\"ql-indent-2\">Exhibition added successfully with Title: {Title}</li><li class=\"ql-indent-2\">ExhibitionID: {ExhibitionID} Title: {Title} Venue: {Venue} Date: {Date} TicketPrice: {TicketPrice}</li></ul><p><br></p><h4>2. <strong>DisplayAllExhibitions()</strong></h4><ul><li>Retrieves and displays all exhibitions from the Exhibition table.</li><li><strong>Architecture</strong>: Uses a disconnected architecture with <strong>SqlDataAdapter, DataSet, and DataRow.</strong></li><li><strong>Access Modifier</strong>: public</li><li><strong>Declaration Modifier</strong>: static</li><li><strong>Return Type</strong>: void</li><li><strong>Console Messages</strong>:</li><li>If exhibitions are found, the details of each exhibition are displayed in the following format:</li><li class=\"ql-indent-1\">ExhibitionID: {ExhibitionID} Title: {Title} Venue: {Venue} Date: {Date} TicketPrice: {TicketPrice}</li><li>If no exhibitions are found: \"No exhibitions found.\"</li></ul><p><br></p><h4>3. <strong>UpdateExhibition(int exhibitionID, Exhibition exhibition)</strong></h4><ul><li>Updates the details of an existing exhibition based on ExhibitionID.</li><li><strong>Parameters</strong>:</li><li class=\"ql-indent-1\">exhibitionID: The ID of the exhibition to update.</li><li class=\"ql-indent-1\">exhibition: An Exhibition object containing the updated details.</li><li><strong>Access Modifier</strong>: public</li><li><strong>Return Type</strong>: void</li><li><strong>Console Messages</strong>:</li><li class=\"ql-indent-1\">If updated successfully:</li><li class=\"ql-indent-2\">Exhibition information updated successfully.</li><li class=\"ql-indent-1\">If no exhibition is found: \"No exhibition found with ID {exhibitionID}.\"</li></ul><h4><br></h4><h4>4. <strong>DeleteExhibition(int exhibitionID)</strong></h4><ul><li>Deletes an exhibition from the Exhibition table based on the provided ExhibitionID.</li><li><strong>Architecture</strong>: Uses a disconnected architecture with SqlConnection, DataSet, SqlCommand, and SqlCommandBuilder.</li><li><strong>Parameters</strong>: The ExhibitionID of the exhibition to delete.</li><li><strong>Access Modifier</strong>: public</li><li><strong>Declaration Modifier</strong>: static</li><li><strong>Return Type</strong>: void</li><li><strong>Console Messages</strong>:</li><li class=\"ql-indent-1\">If the exhibition is successfully deleted:</li><li class=\"ql-indent-2\">Exhibition deleted successfully.</li><li class=\"ql-indent-1\">If no exhibition is found with the given ExhibitionID: \"No exhibition found with ID {exhibitionID}.\"</li></ul><h4><br></h4><h3>Main Menu:</h3><p>The main menu serves as the user interface for interacting with the system. It provides the following options:</p><p><strong>Exhibition Management Menu - Enter your choice (1-5):</strong></p><ol><li>Add Exhibition</li><li>Delete Exhibition by ID</li><li>Update Exhibition Information</li><li>Display All Exhibitions</li><li>Exit - Terminates the application with the message \"Exiting the application...\".</li></ol><p><strong>Invalid choice</strong> - Displays \"Invalid choice.\" if the input does not match any menu options.</p><p><strong>Refer the sample output:</strong></p><p><br></p><p><strong>Add Exhibition:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-3\"></p><p><strong>Display Exhibition:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-4\"></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-5\"></p><p><strong>Update </strong><strong style=\"color: rgb(51, 51, 51);\">Exhibition:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-6\"></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-7\"></p><p><strong>Delete </strong><strong style=\"color: rgb(51, 51, 51);\">Exhibition:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-8\"></p><p><strong>Exit:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-9\"></p><p><strong>Invalid Choice:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/253346201-10\"></p>",
    //         "codeComponents": [],
    //         "aiAnalysis": "No solution is fetched",
    //         "Test_Submitted_Time": "2024-12-27 | 05:29:57 PM",
    //         "Differnce_In_Submission": "The difference is more than 5 minutes or not recorded on submission of test. Check manually for Latest Code",
    //         "log": [
    //             "[\n  \"    0 Error(s)\",\n  \"/home/coder/project/workspace/dotnetapp/Program.cs(41,42): error CS1003: Syntax error, ',' expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n  \"/home/coder/project/workspace/dotnetapp/Program.cs(41,42): error CS1003: Syntax error, ',' expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n  \"    1 Error(s)\"\n]"
    //         ],
    //         "TestCode": {}
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
          width: '600px',
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
          width: '100%',
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
