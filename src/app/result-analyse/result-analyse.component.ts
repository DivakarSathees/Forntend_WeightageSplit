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
  fileType = "utestid"
  analysisType: string = ''; // To store the selected analysis type
  email: string = ''; // For email input
  password: string = ''; // For password input
  course: string = ''; // For course input
  module: string = ''; // For module input
  testName: string = ''; // For test name input
  token: string = ''; // For token input
  loginUrl: string = ''; // For login URL input

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
  onFileTypeChange(type: string) {
    this.fileType = type;
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
        formData.append('USEREMAIL', this.email);
        formData.append('PASSWORD', this.password);
        formData.append('token', this.token);
        formData.append('COURSE', this.course);
        formData.append('MODULE', this.module);
        formData.append('TESTNAME', this.testName);
        formData.append('LOGIN_URL', this.loginUrl);
        // Set up headers to indicate form data
        const headers = new HttpHeaders();
        headers.set('enctype', 'multipart/form-data');
        console.log(formData);
        if (this.fileType === 'utestid') {
          formData.set('COURSE', '');
        }
        if(this.authType === 'credentials'){
          // clear the token in form data to empty string
          formData.set('token', '');
        }

    //     this.loading = false;
    //         this.table = true;

    //   this.responseinJson = [
    //     {
    //         "key": "ecbdcbaee322261266efeaacedbdbone",
    //         "test_Id": "https://admin.ltimindtree.iamneo.ai/result?testId=U2FsdGVkX19iLnuZwbKHGqmBCjDBBUxZ4FXd5%2FG3Azb%2B%2BT%2BPBAaypXRFwgsBDhk1MfNfZF%2FYrvNB5rURliH7cxzE2%2BpMEdwESRvJhErAzsD6tyg8ktHkUtIAduYH%2BjeAKqKDFCVZmzUGKRUi29I0nA%3D%3D",
    //         "name": "Rohit Patel",
    //         "tcList": [
    //             {
    //                 "evaluation_type": "Puppeteer",
    //                 "name": "Existence_of_review_and_delete_button_and_table_along_with_rows_in_available_movies_page",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Puppeteer",
    //                 "name": "Existence_of_review_button_in_available_movies_page_and_heading_in_movie_review_form_page",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Puppeteer",
    //                 "name": "Existence_of_delete_button_and_heading_in_delete_confirmation_page",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "ReviewForm_Post_Method_ValidData_CreatesReviewAndRedirects",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "ReviewForm_Post_Method_ThrowsException_With_Message",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "MovieClassExists",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "MovieReviewExists",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "ApplicationDbContextContainsDbSetMovieReviewProperty",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "ApplicationDbContextContainsDbSetMovieProperty",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Movie_Properties_MovieID_ReturnExpectedDataTypes",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Movie_Properties_Title_ReturnExpectedDataTypes",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Movie_Properties_Director_ReturnExpectedDataTypes",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Movie_Properties_MovieID_ReturnExpectedValues",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Movie_Properties_Title_ReturnExpectedValues",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Movie_Properties_Director_ReturnExpectedValues",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "MovieReview_Properties_MovieReviewID_ReturnExpectedDataTypes",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "MovieReview_Properties_ReviewerName_ReturnExpectedDataTypes",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "MovieReview_Properties_MovieID_ReturnExpectedDataTypes",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "MovieReview_Properties_Returns_Movie_ExpectedValues",
    //                 "result": "Compilation Error"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "DeleteMovieConfirmed_Post_Method_ValidMovieID_RemovesMovieFromDatabase",
    //                 "result": "Compilation Error"
    //             }
    //         ],
    //         "QuestionData": "<h3>Movie Review System</h3><p>The below application should be created using <strong>ASP.NET MVC Core &amp; Entity Framework Core.</strong></p><p><br></p><p>Lia is a film enthusiast and an aspiring movie critic known for her insightful reviews and comprehensive knowledge of cinema. To streamline the review process and provide a platform for sharing movie reviews, she has decided to develop a software application.</p><p><br></p><p>The Movie Review System is a web application developed using ASP.NET MVC Core and EF Core. This system allows Lia to manage her movie reviews and enables users to submit their reviews for different movies. The system incorporates a one-to-many relationship between a movie and reviews, where each movie can have multiple reviews. The system also includes business rule logic and validation checks to ensure smooth operation, including custom exceptions for invalid review data.</p><p><br></p><p>The <strong>Movie Review System</strong> has the following:</p><p><strong>1.Models folder should have the following files:</strong></p><p><strong> \ta.Movie (Models/Movie.cs):</strong></p><ul><li>The Movie class represents a movie in the review system.</li><li><strong>Properties:</strong></li><li class=\"ql-indent-1\"><strong>MovieID</strong> (int): Unique identifier for each movie (auto-increments by 1).</li><li class=\"ql-indent-1\"><strong>Title</strong> (string): Title of the movie. This is a required field.</li><li class=\"ql-indent-1\"><strong>Director</strong> (string): Director of the movie. This is a required field.</li><li class=\"ql-indent-1\"><strong>Reviews (ICollection&lt;MovieReview&gt;)</strong>: Collection of reviews for the movie.</li></ul><p>\t</p><p>\t<strong style=\"color: rgb(55, 65, 81);\">b. </strong><strong>MovieReview (Models/MovieReview.cs):</strong></p><ul><li>The <strong>MovieReview</strong> class represents an participant in the movie review system.</li><li><strong>Properties:</strong></li><li class=\"ql-indent-1\"><strong>MovieReviewID</strong> (int): Unique identifier for each review, automatically incremented by 1.</li><li class=\"ql-indent-1\"><strong>MovieID</strong> (int): Required field that references the associated movie.</li><li class=\"ql-indent-1\"><strong>ReviewerName</strong> (string): Name of the person who wrote the review. This is a required field.</li><li class=\"ql-indent-1\"><strong>Rating</strong> (int): Rating given to the movie. This is a required field and must be between 1 and 5.</li><li class=\"ql-indent-1\"><strong>Movie</strong> (Movie): The related Movie entity associated with the review.</li></ul><p><br></p><p>\t<strong style=\"color: rgb(55, 65, 81);\">c. </strong><strong>ApplicationDbContext </strong><strong style=\"color: rgb(55, 65, 81);\">(Models/</strong><strong>ApplicationDbContext </strong><strong style=\"color: rgb(55, 65, 81);\">.cs)</strong><strong>:</strong></p><ul><li class=\"ql-indent-1\"><strong>Do not modify or add any extra data. Work with the seeded data only. </strong></li><li class=\"ql-indent-1\">Define a <strong>DbSet</strong> for two tables in the <strong>ApplicationDbContext</strong> class.</li><li class=\"ql-indent-2\"><strong>Movies</strong></li><li class=\"ql-indent-2\"><strong>MovieReviews</strong></li></ul><p><br></p><p><strong style=\"color: rgb(55, 65, 81);\">2.</strong><strong>\tException folder should have the following exception file:</strong></p><p>\t<strong style=\"color: rgb(55, 65, 81);\">a. </strong><strong>MovieReviewException: </strong><span style=\"color: rgb(55, 65, 81);\">A custom exception class that will throw exceptions with custom messages. </span></p><ul><li class=\"ql-indent-1\">Implement a custom exception class named <strong>MovieReviewException</strong> <strong>(namespace dotnetapp.Exceptions). </strong></li><li class=\"ql-indent-1\">Use <strong>MovieReviewException</strong> to handle cases where the rating is out of the valid range (1 to 5).</li><li class=\"ql-indent-1\">When the rating is invalid, throw a custom exception message such as<strong> \"The rating must be between 1 and 5\".</strong></li></ul><p><br></p><p><strong style=\"color: rgb(55, 65, 81);\">3. Controllers </strong><strong>folder should have the following controller files</strong><strong style=\"color: rgb(55, 65, 81);\">:</strong></p><p><strong>\t</strong><strong style=\"color: rgb(55, 65, 81);\">a. </strong><strong>MovieReviewController (Controllers/MovieReviewController.cs):</strong></p><p>\t\tThis controller handles actions related to movie reviews, including displaying the review form, processing review submissions, and confirming the review.</p><p>\t\t<strong>Actions</strong>: Return a 404 Not Found result accordingly.</p><ul><li><strong style=\"color: rgb(51, 51, 51);\">public </strong><strong>IActionResult ReviewForm(int MovieID)</strong></li><li class=\"ql-indent-1\"><strong>GET: MovieReview/ReviewForm/{id}</strong></li><li class=\"ql-indent-1\">Define an action method to display the review form for a specific movie</li><li class=\"ql-indent-1\">Find the movie by ID</li><li class=\"ql-indent-1\">Check if the movie is not found</li><li class=\"ql-indent-1\">Return the view for the review form</li><li><strong>public IActionResult ReviewForm(int MovieID, MovieReview movieReview)</strong></li><li class=\"ql-indent-1\"><strong>POST: MovieReview/ReviewForm</strong></li><li class=\"ql-indent-1\">Specify that this action method handles POST requests</li><li class=\"ql-indent-1\">Define an action method to handle the submission of the review form</li><li class=\"ql-indent-1\">Find the movie by ID and include its reviews</li><li class=\"ql-indent-1\">Check if the movie is not found</li><li class=\"ql-indent-1\">Set the MovieID of the review to the specified MovieID</li><li class=\"ql-indent-1\">Check if the model state is not valid</li><li class=\"ql-indent-1\">Return the view with the review model to display validation errors</li><li class=\"ql-indent-1\">Check if the rating is out of the valid range and throw a custom exception with a specific message</li><li class=\"ql-indent-1\">Add the review to the database context</li><li class=\"ql-indent-1\">Redirect to AvailableMovies page.</li></ul><p><br></p><p>\t<strong style=\"color: rgb(55, 65, 81);\">b.M</strong><strong>ovieController (Controllers/</strong><strong style=\"color: rgb(55, 65, 81);\">M</strong><strong style=\"color: rgb(51, 51, 51);\">ovieController</strong><strong>.cs):</strong></p><p>\t\tConsists of actions for handling tour enrollment and confirmation of enrollment.</p><p><strong>\t\tActions: </strong><span style=\"color: rgb(51, 51, 51);\">Return a 404 Not Found result accordingly.</span></p><ul><li><strong style=\"color: rgb(51, 51, 51);\">public </strong><strong>&lt;IActionResult&gt; AvailableMovies()</strong></li><li class=\"ql-indent-1\">This method handles GET requests to retrieve a list of available movies and return the View.</li><li><strong>public async Task&lt;IActionResult&gt; DeleteConfirmation(int id)</strong></li><li class=\"ql-indent-1\"><strong>GET: Movie/DeleteConfirmation/{id}</strong></li><li class=\"ql-indent-1\">Define an asynchronous action method for delete confirmation</li><li class=\"ql-indent-1\">Find the movie by ID</li><li class=\"ql-indent-1\">Return the view with the movie as the model</li></ul><p><br></p><ul><li><strong>public async Task&lt;IActionResult&gt; DeleteMovieConfirmed(int id)</strong></li><li class=\"ql-indent-1\"><strong>POST: Movie/DeleteMovie/{id}</strong></li><li class=\"ql-indent-1\">Define a POST action method with the name \"DeleteMovie\"</li><li class=\"ql-indent-1\">Define an asynchronous action method for confirming movie deletion</li><li class=\"ql-indent-1\">Find the movie by ID</li><li class=\"ql-indent-1\">Remove the movie from the database context</li><li class=\"ql-indent-1\">Redirect to the AvailableMovies action</li></ul><p><br></p><p><strong style=\"color: rgb(55, 65, 81);\">3. Views:&nbsp;</strong></p><p>      <strong style=\"color: rgb(55, 65, 81);\">a. </strong><strong style=\"color: rgb(51, 51, 51);\">AvailableMovies</strong><strong> View </strong><strong style=\"color: rgb(51, 51, 51);\">(Views/Movie/AvailableMovies.cshtml)</strong><strong style=\"color: rgb(55, 65, 81);\">: </strong></p><ul><li>Displays available movies with options to review or delete.</li><li>Displays the heading<strong> \"Movie Review System\"</strong> using an <strong>h1 </strong>tag.</li><li>The table should have headers with the column names as: Title, Director, Actions.</li><li>Each movie has options to review and delete.</li><li>The \"Review\" button <span style=\"color: rgb(51, 51, 51);\">with id attribute set to \"</span><strong style=\"color: rgb(51, 51, 51);\">reviewButton</strong><span style=\"color: rgb(51, 51, 51);\">\" </span>allows users to submit a review for a movie. When clicked, it navigates to the ReviewForm page, where users can access the review form for a specific movie. For example, when the movie with ID 1 is selected, the URL should be directed to /MovieReview/ReviewForm?movieId=1. </li><li>A \"Delete\" button with id attribute set to \"<strong>deleteButton</strong>\" is present for each movie to delete the movie with the selected ID. On clicking the delete button, it navigates to the DeleteConfirmation page. For example, when the movie with ID 1 is selected, the URL should be directed to /Movie/DeleteConfirmation/1.</li><li>A message is displayed as 'No available movies.' when movies are not available.</li></ul><p><br></p><p><strong>\tb. </strong><strong style=\"color: rgb(51, 51, 51);\">DeleteConfirmation (Views/MovieReview/DeleteConfirmation.cshtml)</strong><strong> View:</strong></p><ul><li>Displays a confirmation page to delete a movie.</li><li>Displays the heading \"<strong>Delete Movie</strong>\" using an <strong>h2</strong> tag.</li><li>Displays a confirmation message: \"Are you sure you want to delete this movie?\"</li><li>Displays movie details in a definition list (&lt;dl&gt;) with the following structure:</li><li>Title: &lt;dt&gt; tag with the label \"Title\" and &lt;dd&gt; tag showing @Model.Title.</li><li>Director: &lt;dt&gt; tag with the label \"Director\" and &lt;dd&gt; tag showing @Model.Director.</li><li>A form is provided to confirm the deletion:</li><li>The form submits a POST request to the DeleteMovie action of the Movie controller, using asp-route-id to pass the movie ID (@Model.MovieID).</li><li>Includes a submit button with the class btn btn-danger and the value \"Delete\".</li><li>Includes a \"Cancel\" button with the class btn btn-secondary that redirects users to the AvailableMovies action of the Movie controller.</li></ul><p><br></p><p><strong>\tc.</strong><strong style=\"color: rgb(51, 51, 51);\">ReviewForm (Views/MovieReview/ReviewForm.cshtml)</strong></p><ul><li>Displays a form for users to submit a movie review.</li><li>Displays the heading \"Movie Review Form\" using an h2 tag.</li><li>Provides a form for users to enter their review details:</li><li>Name: Input field for the reviewer's name with associated validation messages.</li><li>Rating: Input field for the review rating with associated validation messages.</li><li>Uses Html.BeginForm to create the form with POST method, targeting the ReviewForm action in the MovieReview controller. The form includes a hidden field for MovieID.</li><li>Each input field is accompanied by a label and validation message:</li><li>Name field is bound to model.ReviewerName.</li><li>Rating field is bound to model.Rating.</li><li>The \"Submit Review\" button allows users to submit the form, styled with the class btn btn-primary.</li><li>This link is styled with the class btn btn-secondary and directs to the AvailableMovies action in the Movie controller.</li></ul><p><span style=\"color: rgb(72, 72, 72);\">&nbsp;</span></p><p><strong>Note: (Make use of this dataset for the Classes table)</strong></p><p><strong>***Insert values for Class table directly from SQL Server (or) Seed directly from&nbsp;ApplicationDbContext using ModelBuilder (Provided in ApplicationDbContext class)***</strong></p><p><br></p><p>modelBuilder.Entity&lt;Movie&gt;().HasData(</p><p>     new Movie { MovieID = 1, Title = \"Inception\", Director = \"Christopher Nolan\"},</p><p>     new Movie { MovieID = 2, Title = \"The Matrix\", Director = \"The Wachowskis\"},</p><p>     new Movie { MovieID = 3, Title = \"The Shawshank Redemption\", Director = \"Frank Darabont\"},</p><p>      new Movie { MovieID = 4, Title = \"The Godfather\", Director = \"Francis Ford Coppola\"},</p><p>      new Movie { MovieID = 5, Title = \"The Dark Knight\", Director = \"Christopher Nolan\"}</p><p>                );</p><p class=\"ql-align-justify\"><strong style=\"color: rgb(72, 72, 72);\">Note: The available Class details can be seeded or directly inserted in the database.&nbsp;</strong></p><p class=\"ql-align-justify\"><strong style=\"color: rgb(72, 72, 72);\">Do not change the class names.&nbsp;</strong></p><p class=\"ql-align-justify\"><strong>Do not change the skeleton&nbsp;(Structure of the given project)</strong></p><p><br></p><p><strong>4. Commands to Run the Project:</strong></p><p><br></p><p><strong>Important Note:</strong></p><p><strong>Before running test cases &amp; submitting the project, make sure that your application is running on port 8081 (dotnet run)</strong></p><p><br></p><ul><li><strong>cd dotnetapp</strong></li></ul><p>Select the dotnet project folder</p><ul><li><strong>dotnet restore</strong></li></ul><p>This command will restore all the required packages to run the application.</p><ul><li><strong>dotnet run</strong></li></ul><p>To run the application in port 8081 (The settings preloaded click 8081 Port to View)</p><ul><li><strong>dotnet build</strong></li></ul><p>To build and check for errors</p><ul><li><strong>dotnet clean</strong></li></ul><p>If the same error persists clean the project and build again</p><p><br></p><p>Please ensure that the application is running on port <strong>8081</strong> before clicking the \"<strong>Run Test Case</strong>\" button. The application must be actively running on the specified port for the Puppeteer test cases to be executed successfully. </p><p><br></p><p>To work with Entity Framework Core:</p><p>Install EF using the following commands:</p><p>&nbsp;<strong>dotnet new tool-manifest</strong></p><p>&nbsp;</p><p><strong>dotnet tool install --local dotnet-ef --version 6.0.6</strong></p><p><strong>&nbsp;</strong></p><p><strong>dotnet dotnet-ef </strong>--To check the EF installed or not</p><p><br></p><p><strong>dotnet dotnet-ef migrations add \"InitialSetup\" </strong>--command to setup the initial creation of tables mentioned in DBContext</p><p>&nbsp;</p><p><strong>dotnet dotnet-ef database update </strong>--command to update the database</p><p>&nbsp;</p><p><strong>To Work with SQLServer:</strong></p><p>(Open a New Terminal) type the below commands</p><p><strong>sqlcmd -U sa&nbsp;</strong></p><p>password: <strong>examlyMssql@123</strong></p><p>&nbsp;</p><p>&gt;use DBName</p><p>&gt;go</p><p><br></p><p>1&gt; insert into TableName values(\" \",\" \",...)</p><p>2&gt; go</p><p>&nbsp;</p><p><strong>Note:</strong></p><ol><li>Database Name should be&nbsp;<strong>appdb</strong></li><li><strong>Use the below sample connection string to connect the MsSql Server</strong></li></ol><p><strong>﻿connectionString&nbsp;= \"User ID=sa;password=examlyMssql@123; server=localhost;Database=appdb;trusted_connection=false;Persist Security Info=False;Encrypt=False\";</strong></p><p><br></p><p><strong>Screenshots:</strong></p><p><strong>1. Available Movies:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/1978095184-1\"></p><p><br></p><p><strong>2.\tDelete Confirmation:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/1978095184-2\"></p><p><br></p><p><strong>&nbsp;3. Movie Review Form: </strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/1978095184-3\"></p><p><br></p><p><br></p><p><strong>4. Validations in </strong><strong style=\"color: rgb(51, 51, 51);\">Movie Review Form: </strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/1978095184-4\"></p>",
    //         "codeComponents": [],
    //         "aiAnalysis": "null",
    //         "Test_Submitted_Time": "2025-01-10 | 06:15:14 PM",
    //         "Differnce_In_Submission": "The difference is more than 5 minutes or not recorded on submission of test. Check manually for Latest Code",
    //         "log": [
    //             "{\n  \"passed\": [],\n  \"failed\": [\n    \"Existence_of_review_and_delete_button_and_table_along_with_rows_in_available_movies_page\",\n    \"Existence_of_review_button_in_available_movies_page_and_heading_in_movie_review_form_page\",\n    \"Existence_of_delete_button_and_heading_in_delete_confirmation_page\"\n  ],\n  \"errors\": []\n}",
    //             "{\n  \"passed\": [],\n  \"failed\": [],\n  \"errors\": [\n    [\n      \"    0 Error(s)\",\n      \"/home/coder/project/workspace/dotnetapp/Exceptions/MovieReviewException.cs(5,13): error CS0116: A namespace cannot directly contain members such as fields, methods or statements [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Exceptions/MovieReviewException.cs(5,13): error CS1520: Method must have a return type [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Exceptions/MovieReviewException.cs(5,13): error CS0116: A namespace cannot directly contain members such as fields, methods or statements [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Exceptions/MovieReviewException.cs(5,13): error CS1520: Method must have a return type [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"    2 Error(s)\"\n    ]\n  ]\n}"
    //         ],
    //         "TestCode": {}
    //     },
    //     {
    //         "key": "faecaffafdb322261090efeaacedbdbone",
    //         "test_Id": "",
    //         "name": "Harsh Shrivastava",
    //         "tcList": [
    //             {
    //                 "evaluation_type": "Puppeteer",
    //                 "name": "Existence_of_review_and_delete_button_and_table_along_with_rows_in_available_movies_page",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Puppeteer",
    //                 "name": "Existence_of_review_button_in_available_movies_page_and_heading_in_movie_review_form_page",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Puppeteer",
    //                 "name": "Existence_of_delete_button_and_heading_in_delete_confirmation_page",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "ReviewForm_Post_Method_ValidData_CreatesReviewAndRedirects",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "ReviewForm_Post_Method_ThrowsException_With_Message",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "MovieClassExists",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "MovieReviewExists",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "ApplicationDbContextContainsDbSetMovieReviewProperty",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "ApplicationDbContextContainsDbSetMovieProperty",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Movie_Properties_MovieID_ReturnExpectedDataTypes",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Movie_Properties_Title_ReturnExpectedDataTypes",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Movie_Properties_Director_ReturnExpectedDataTypes",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Movie_Properties_MovieID_ReturnExpectedValues",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Movie_Properties_Title_ReturnExpectedValues",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Movie_Properties_Director_ReturnExpectedValues",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "MovieReview_Properties_MovieReviewID_ReturnExpectedDataTypes",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "MovieReview_Properties_ReviewerName_ReturnExpectedDataTypes",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "MovieReview_Properties_MovieID_ReturnExpectedDataTypes",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "MovieReview_Properties_Returns_Movie_ExpectedValues",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "DeleteMovieConfirmed_Post_Method_ValidMovieID_RemovesMovieFromDatabase",
    //                 "result": "Success"
    //             }
    //         ],
    //         "QuestionData": "<h3>Movie Review System</h3><p>The below application should be created using <strong>ASP.NET MVC Core &amp; Entity Framework Core.</strong></p><p><br></p><p>Lia is a film enthusiast and an aspiring movie critic known for her insightful reviews and comprehensive knowledge of cinema. To streamline the review process and provide a platform for sharing movie reviews, she has decided to develop a software application.</p><p><br></p><p>The Movie Review System is a web application developed using ASP.NET MVC Core and EF Core. This system allows Lia to manage her movie reviews and enables users to submit their reviews for different movies. The system incorporates a one-to-many relationship between a movie and reviews, where each movie can have multiple reviews. The system also includes business rule logic and validation checks to ensure smooth operation, including custom exceptions for invalid review data.</p><p><br></p><p>The <strong>Movie Review System</strong> has the following:</p><p><strong>1.Models folder should have the following files:</strong></p><p><strong> \ta.Movie (Models/Movie.cs):</strong></p><ul><li>The Movie class represents a movie in the review system.</li><li><strong>Properties:</strong></li><li class=\"ql-indent-1\"><strong>MovieID</strong> (int): Unique identifier for each movie (auto-increments by 1).</li><li class=\"ql-indent-1\"><strong>Title</strong> (string): Title of the movie. This is a required field.</li><li class=\"ql-indent-1\"><strong>Director</strong> (string): Director of the movie. This is a required field.</li><li class=\"ql-indent-1\"><strong>Reviews (ICollection&lt;MovieReview&gt;)</strong>: Collection of reviews for the movie.</li></ul><p>\t</p><p>\t<strong style=\"color: rgb(55, 65, 81);\">b. </strong><strong>MovieReview (Models/MovieReview.cs):</strong></p><ul><li>The <strong>MovieReview</strong> class represents an participant in the movie review system.</li><li><strong>Properties:</strong></li><li class=\"ql-indent-1\"><strong>MovieReviewID</strong> (int): Unique identifier for each review, automatically incremented by 1.</li><li class=\"ql-indent-1\"><strong>MovieID</strong> (int): Required field that references the associated movie.</li><li class=\"ql-indent-1\"><strong>ReviewerName</strong> (string): Name of the person who wrote the review. This is a required field.</li><li class=\"ql-indent-1\"><strong>Rating</strong> (int): Rating given to the movie. This is a required field and must be between 1 and 5.</li><li class=\"ql-indent-1\"><strong>Movie</strong> (Movie): The related Movie entity associated with the review.</li></ul><p><br></p><p>\t<strong style=\"color: rgb(55, 65, 81);\">c. </strong><strong>ApplicationDbContext </strong><strong style=\"color: rgb(55, 65, 81);\">(Models/</strong><strong>ApplicationDbContext </strong><strong style=\"color: rgb(55, 65, 81);\">.cs)</strong><strong>:</strong></p><ul><li class=\"ql-indent-1\"><strong>Do not modify or add any extra data. Work with the seeded data only. </strong></li><li class=\"ql-indent-1\">Define a <strong>DbSet</strong> for two tables in the <strong>ApplicationDbContext</strong> class.</li><li class=\"ql-indent-2\"><strong>Movies</strong></li><li class=\"ql-indent-2\"><strong>MovieReviews</strong></li></ul><p><br></p><p><strong style=\"color: rgb(55, 65, 81);\">2.</strong><strong>\tException folder should have the following exception file:</strong></p><p>\t<strong style=\"color: rgb(55, 65, 81);\">a. </strong><strong>MovieReviewException: </strong><span style=\"color: rgb(55, 65, 81);\">A custom exception class that will throw exceptions with custom messages. </span></p><ul><li class=\"ql-indent-1\">Implement a custom exception class named <strong>MovieReviewException</strong> <strong>(namespace dotnetapp.Exceptions). </strong></li><li class=\"ql-indent-1\">Use <strong>MovieReviewException</strong> to handle cases where the rating is out of the valid range (1 to 5).</li><li class=\"ql-indent-1\">When the rating is invalid, throw a custom exception message such as<strong> \"The rating must be between 1 and 5\".</strong></li></ul><p><br></p><p><strong style=\"color: rgb(55, 65, 81);\">3. Controllers </strong><strong>folder should have the following controller files</strong><strong style=\"color: rgb(55, 65, 81);\">:</strong></p><p><strong>\t</strong><strong style=\"color: rgb(55, 65, 81);\">a. </strong><strong>MovieReviewController (Controllers/MovieReviewController.cs):</strong></p><p>\t\tThis controller handles actions related to movie reviews, including displaying the review form, processing review submissions, and confirming the review.</p><p>\t\t<strong>Actions</strong>: Return a 404 Not Found result accordingly.</p><ul><li><strong style=\"color: rgb(51, 51, 51);\">public </strong><strong>IActionResult ReviewForm(int MovieID)</strong></li><li class=\"ql-indent-1\"><strong>GET: MovieReview/ReviewForm/{id}</strong></li><li class=\"ql-indent-1\">Define an action method to display the review form for a specific movie</li><li class=\"ql-indent-1\">Find the movie by ID</li><li class=\"ql-indent-1\">Check if the movie is not found</li><li class=\"ql-indent-1\">Return the view for the review form</li><li><strong>public IActionResult ReviewForm(int MovieID, MovieReview movieReview)</strong></li><li class=\"ql-indent-1\"><strong>POST: MovieReview/ReviewForm</strong></li><li class=\"ql-indent-1\">Specify that this action method handles POST requests</li><li class=\"ql-indent-1\">Define an action method to handle the submission of the review form</li><li class=\"ql-indent-1\">Find the movie by ID and include its reviews</li><li class=\"ql-indent-1\">Check if the movie is not found</li><li class=\"ql-indent-1\">Set the MovieID of the review to the specified MovieID</li><li class=\"ql-indent-1\">Check if the model state is not valid</li><li class=\"ql-indent-1\">Return the view with the review model to display validation errors</li><li class=\"ql-indent-1\">Check if the rating is out of the valid range and throw a custom exception with a specific message</li><li class=\"ql-indent-1\">Add the review to the database context</li><li class=\"ql-indent-1\">Redirect to AvailableMovies page.</li></ul><p><br></p><p>\t<strong style=\"color: rgb(55, 65, 81);\">b.M</strong><strong>ovieController (Controllers/</strong><strong style=\"color: rgb(55, 65, 81);\">M</strong><strong style=\"color: rgb(51, 51, 51);\">ovieController</strong><strong>.cs):</strong></p><p>\t\tConsists of actions for handling tour enrollment and confirmation of enrollment.</p><p><strong>\t\tActions: </strong><span style=\"color: rgb(51, 51, 51);\">Return a 404 Not Found result accordingly.</span></p><ul><li><strong style=\"color: rgb(51, 51, 51);\">public </strong><strong>&lt;IActionResult&gt; AvailableMovies()</strong></li><li class=\"ql-indent-1\">This method handles GET requests to retrieve a list of available movies and return the View.</li><li><strong>public async Task&lt;IActionResult&gt; DeleteConfirmation(int id)</strong></li><li class=\"ql-indent-1\"><strong>GET: Movie/DeleteConfirmation/{id}</strong></li><li class=\"ql-indent-1\">Define an asynchronous action method for delete confirmation</li><li class=\"ql-indent-1\">Find the movie by ID</li><li class=\"ql-indent-1\">Return the view with the movie as the model</li></ul><p><br></p><ul><li><strong>public async Task&lt;IActionResult&gt; DeleteMovieConfirmed(int id)</strong></li><li class=\"ql-indent-1\"><strong>POST: Movie/DeleteMovie/{id}</strong></li><li class=\"ql-indent-1\">Define a POST action method with the name \"DeleteMovie\"</li><li class=\"ql-indent-1\">Define an asynchronous action method for confirming movie deletion</li><li class=\"ql-indent-1\">Find the movie by ID</li><li class=\"ql-indent-1\">Remove the movie from the database context</li><li class=\"ql-indent-1\">Redirect to the AvailableMovies action</li></ul><p><br></p><p><strong style=\"color: rgb(55, 65, 81);\">3. Views:&nbsp;</strong></p><p>      <strong style=\"color: rgb(55, 65, 81);\">a. </strong><strong style=\"color: rgb(51, 51, 51);\">AvailableMovies</strong><strong> View </strong><strong style=\"color: rgb(51, 51, 51);\">(Views/Movie/AvailableMovies.cshtml)</strong><strong style=\"color: rgb(55, 65, 81);\">: </strong></p><ul><li>Displays available movies with options to review or delete.</li><li>Displays the heading<strong> \"Movie Review System\"</strong> using an <strong>h1 </strong>tag.</li><li>The table should have headers with the column names as: Title, Director, Actions.</li><li>Each movie has options to review and delete.</li><li>The \"Review\" button <span style=\"color: rgb(51, 51, 51);\">with id attribute set to \"</span><strong style=\"color: rgb(51, 51, 51);\">reviewButton</strong><span style=\"color: rgb(51, 51, 51);\">\" </span>allows users to submit a review for a movie. When clicked, it navigates to the ReviewForm page, where users can access the review form for a specific movie. For example, when the movie with ID 1 is selected, the URL should be directed to /MovieReview/ReviewForm?movieId=1. </li><li>A \"Delete\" button with id attribute set to \"<strong>deleteButton</strong>\" is present for each movie to delete the movie with the selected ID. On clicking the delete button, it navigates to the DeleteConfirmation page. For example, when the movie with ID 1 is selected, the URL should be directed to /Movie/DeleteConfirmation/1.</li><li>A message is displayed as 'No available movies.' when movies are not available.</li></ul><p><br></p><p><strong>\tb. </strong><strong style=\"color: rgb(51, 51, 51);\">DeleteConfirmation (Views/MovieReview/DeleteConfirmation.cshtml)</strong><strong> View:</strong></p><ul><li>Displays a confirmation page to delete a movie.</li><li>Displays the heading \"<strong>Delete Movie</strong>\" using an <strong>h2</strong> tag.</li><li>Displays a confirmation message: \"Are you sure you want to delete this movie?\"</li><li>Displays movie details in a definition list (&lt;dl&gt;) with the following structure:</li><li>Title: &lt;dt&gt; tag with the label \"Title\" and &lt;dd&gt; tag showing @Model.Title.</li><li>Director: &lt;dt&gt; tag with the label \"Director\" and &lt;dd&gt; tag showing @Model.Director.</li><li>A form is provided to confirm the deletion:</li><li>The form submits a POST request to the DeleteMovie action of the Movie controller, using asp-route-id to pass the movie ID (@Model.MovieID).</li><li>Includes a submit button with the class btn btn-danger and the value \"Delete\".</li><li>Includes a \"Cancel\" button with the class btn btn-secondary that redirects users to the AvailableMovies action of the Movie controller.</li></ul><p><br></p><p><strong>\tc.</strong><strong style=\"color: rgb(51, 51, 51);\">ReviewForm (Views/MovieReview/ReviewForm.cshtml)</strong></p><ul><li>Displays a form for users to submit a movie review.</li><li>Displays the heading \"Movie Review Form\" using an h2 tag.</li><li>Provides a form for users to enter their review details:</li><li>Name: Input field for the reviewer's name with associated validation messages.</li><li>Rating: Input field for the review rating with associated validation messages.</li><li>Uses Html.BeginForm to create the form with POST method, targeting the ReviewForm action in the MovieReview controller. The form includes a hidden field for MovieID.</li><li>Each input field is accompanied by a label and validation message:</li><li>Name field is bound to model.ReviewerName.</li><li>Rating field is bound to model.Rating.</li><li>The \"Submit Review\" button allows users to submit the form, styled with the class btn btn-primary.</li><li>This link is styled with the class btn btn-secondary and directs to the AvailableMovies action in the Movie controller.</li></ul><p><span style=\"color: rgb(72, 72, 72);\">&nbsp;</span></p><p><strong>Note: (Make use of this dataset for the Classes table)</strong></p><p><strong>***Insert values for Class table directly from SQL Server (or) Seed directly from&nbsp;ApplicationDbContext using ModelBuilder (Provided in ApplicationDbContext class)***</strong></p><p><br></p><p>modelBuilder.Entity&lt;Movie&gt;().HasData(</p><p>     new Movie { MovieID = 1, Title = \"Inception\", Director = \"Christopher Nolan\"},</p><p>     new Movie { MovieID = 2, Title = \"The Matrix\", Director = \"The Wachowskis\"},</p><p>     new Movie { MovieID = 3, Title = \"The Shawshank Redemption\", Director = \"Frank Darabont\"},</p><p>      new Movie { MovieID = 4, Title = \"The Godfather\", Director = \"Francis Ford Coppola\"},</p><p>      new Movie { MovieID = 5, Title = \"The Dark Knight\", Director = \"Christopher Nolan\"}</p><p>                );</p><p class=\"ql-align-justify\"><strong style=\"color: rgb(72, 72, 72);\">Note: The available Class details can be seeded or directly inserted in the database.&nbsp;</strong></p><p class=\"ql-align-justify\"><strong style=\"color: rgb(72, 72, 72);\">Do not change the class names.&nbsp;</strong></p><p class=\"ql-align-justify\"><strong>Do not change the skeleton&nbsp;(Structure of the given project)</strong></p><p><br></p><p><strong>4. Commands to Run the Project:</strong></p><p><br></p><p><strong>Important Note:</strong></p><p><strong>Before running test cases &amp; submitting the project, make sure that your application is running on port 8081 (dotnet run)</strong></p><p><br></p><ul><li><strong>cd dotnetapp</strong></li></ul><p>Select the dotnet project folder</p><ul><li><strong>dotnet restore</strong></li></ul><p>This command will restore all the required packages to run the application.</p><ul><li><strong>dotnet run</strong></li></ul><p>To run the application in port 8081 (The settings preloaded click 8081 Port to View)</p><ul><li><strong>dotnet build</strong></li></ul><p>To build and check for errors</p><ul><li><strong>dotnet clean</strong></li></ul><p>If the same error persists clean the project and build again</p><p><br></p><p>Please ensure that the application is running on port <strong>8081</strong> before clicking the \"<strong>Run Test Case</strong>\" button. The application must be actively running on the specified port for the Puppeteer test cases to be executed successfully. </p><p><br></p><p>To work with Entity Framework Core:</p><p>Install EF using the following commands:</p><p>&nbsp;<strong>dotnet new tool-manifest</strong></p><p>&nbsp;</p><p><strong>dotnet tool install --local dotnet-ef --version 6.0.6</strong></p><p><strong>&nbsp;</strong></p><p><strong>dotnet dotnet-ef </strong>--To check the EF installed or not</p><p><br></p><p><strong>dotnet dotnet-ef migrations add \"InitialSetup\" </strong>--command to setup the initial creation of tables mentioned in DBContext</p><p>&nbsp;</p><p><strong>dotnet dotnet-ef database update </strong>--command to update the database</p><p>&nbsp;</p><p><strong>To Work with SQLServer:</strong></p><p>(Open a New Terminal) type the below commands</p><p><strong>sqlcmd -U sa&nbsp;</strong></p><p>password: <strong>examlyMssql@123</strong></p><p>&nbsp;</p><p>&gt;use DBName</p><p>&gt;go</p><p><br></p><p>1&gt; insert into TableName values(\" \",\" \",...)</p><p>2&gt; go</p><p>&nbsp;</p><p><strong>Note:</strong></p><ol><li>Database Name should be&nbsp;<strong>appdb</strong></li><li><strong>Use the below sample connection string to connect the MsSql Server</strong></li></ol><p><strong>﻿connectionString&nbsp;= \"User ID=sa;password=examlyMssql@123; server=localhost;Database=appdb;trusted_connection=false;Persist Security Info=False;Encrypt=False\";</strong></p><p><br></p><p><strong>Screenshots:</strong></p><p><strong>1. Available Movies:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/1978095184-1\"></p><p><br></p><p><strong>2.\tDelete Confirmation:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/1978095184-2\"></p><p><br></p><p><strong>&nbsp;3. Movie Review Form: </strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/1978095184-3\"></p><p><br></p><p><br></p><p><strong>4. Validations in </strong><strong style=\"color: rgb(51, 51, 51);\">Movie Review Form: </strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/1978095184-4\"></p>",
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
    //                                 "name": "MovieController.cs",
    //                                 "code": "using System.Collections.Generic;\nusing Microsoft.EntityFrameworkCore;\nusing Microsoft.AspNetCore.Mvc;\nusing dotnetapp.Models;\nusing System;\nusing System.ComponentModel.DataAnnotations;\nusing System.ComponentModel.DataAnnotations.Schema;\n\nnamespace dotnetapp.Controllers\n{\n    public class MovieController : Controller\n    {\n        public ApplicationDbContext _context;\n\n        public MovieController(ApplicationDbContext context)\n        {\n            _context = context;\n        }\n        // GET: Movie/AvailableMovies\n        [HttpGet]\n        public async Task&lt;IActionResult&gt; AvailableMovies()\n        {\n            // Define an asynchronous action method for available movies\n            var res =  _context.Movies.ToList();\n\n            return View(res);\n        }\n\n        // GET: Movie/DeleteConfirmation/5\n\n        [HttpGet]\n        public async Task&lt;IActionResult&gt; DeleteConfirmation(int id)\n        {\n            // Define an asynchronous action method for delete confirmation\n            // Find the movie by ID\n            // Check if the movie is not found\n            // Return a 404 Not Found result\n            // Return the view with the movie as the model\n            var res = await _context.Movies.FindAsync(id);\n            if(res == null){\n                return NotFound();\n            }\n            return View(res);\n        }\n\n        // POST: Movie/DeleteMovie/5\n        [HttpPost, ActionName(\"DeleteMovie\")]\n        public async Task&lt;IActionResult&gt; DeleteMovieConfirmed(int id)\n        {\n            // Find the movie by ID\n            // Remove the movie from the database context\n            // Save the changes to the database\n            // Redirect to the AvailableMovies action\n\n            var res = await _context.Movies.FindAsync(id);\n            if(res == null){\n               return NotFound();\n            }\n            _context.Movies.Remove(res);\n            _context.SaveChanges(); \n            return RedirectToAction(nameof(AvailableMovies));\n\n        }\n    }\n}"
    //                             },
    //                             {
    //                                 "type": "file",
    //                                 "name": "MovieReviewController.cs",
    //                                 "code": "using System.Collections.Generic;\nusing Microsoft.EntityFrameworkCore;\nusing Microsoft.AspNetCore.Mvc;\nusing dotnetapp.Models;\nusing System;\nusing dotnetapp.Exceptions;\nusing System.ComponentModel.DataAnnotations;\nusing System.ComponentModel.DataAnnotations.Schema;\nnamespace dotnetapp.Controllers\n{\n\n\n    public class MovieReviewController : Controller\n    {\n        // GET: MovieReview/ReviewForm/5\n        public ApplicationDbContext _context;\n\n        public MovieReviewController(ApplicationDbContext context)\n        {\n            _context = context;\n        }\n        [HttpGet]\n        public IActionResult ReviewForm(int MovieID)\n        {\n            // Define an action method to display the review form for a specific movie\n            // Find the movie by ID\n            // Check if the movie is not found\n            // Return a 404 Not Found result\n            // Return the view for the AvailableMovies \n\n            var res = _context.MovieReviews.Find(MovieID);\n            if (res == null)\n            {\n                return NotFound();\n            }\n            return View(res);\n\n        }\n\n        [HttpPost]\n        // POST: MovieReview/ReviewForm\n         public IActionResult ReviewForm(int MovieID, MovieReview movieReview)\n         {\n        //     // Find the movie by ID and include its reviews\n        //     // Check if the movie is not found\n        //     // Add the review to the database context\n        //     // Save the changes to the database\n        //     // Redirect to AvailableMovies action \n//FirstOrDefault(m=&gt;m.MovieID ==MovieID)\n            var res = _context.MovieReviews.FindAsync(MovieID);\n            // res.Include(r =&gt; r.movieReview);\n            if(res == null){\n                return NotFound();\n            }\n\n            //movieid not specified\n            if (!ModelState.IsValid)\n            {\n             return View(res);\n           }\n           return RedirectToAction(\"AvailableMovies\",\"MovieController\");\n         }\n    }\n}"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "directory",
    //                         "name": "Exceptions",
    //                         "contents": [
    //                             {
    //                                 "type": "file",
    //                                 "name": "MovieReviewException.cs",
    //                                 "code": "using Microsoft.EntityFrameworkCore;\nusing Microsoft.AspNetCore;\nusing dotnetapp.Models;\nusing System;\n\nnamespace dotnetapp.Exceptions\n{\n    // Write your Exception Class here...\n\n    public class MovieReviewException : Exception{\n        \n \n        public MovieReviewException(string Message) : base (Message){}\n    }\n}"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "directory",
    //                         "name": "Models",
    //                         "contents": [
    //                             {
    //                                 "type": "file",
    //                                 "name": "ApplicationDbContext.cs",
    //                                 "code": "\nusing Microsoft.EntityFrameworkCore;\nusing System;\n\n\n//using Microsoft.EntityFrameworkCore;\nusing Microsoft.AspNetCore;\nusing dotnetapp.Models;\n\nnamespace dotnetapp.Models\n{\n    public class ApplicationDbContext : DbContext\n    {\n        public ApplicationDbContext(DbContextOptions&lt;ApplicationDbContext&gt; options) : base(options)\n        {\n        }\n\n        // DbSet properties representing the Movies and MovieReviews tables in the database\n        public virtual DbSet&lt;Movie&gt; Movies {get;set;} = null;\n        public virtual DbSet&lt;MovieReview&gt; MovieReviews {get;set;} = null;\n\n        protected override void OnConfiguring(DbContextOptionsBuilder ob){\n            if( !ob.IsConfigured){\n                ob.UseSqlServer(\"User ID=sa;password=examlyMssql@123;server=localhost;Database=appdb;trusted_connection=false;Persist Security Info=False; Encrypt=False\");\n            }\n\n        }\n\n        protected override void OnModelCreating(ModelBuilder modelBuilder)\n        {\n            // Method for configuring the model and seeding initial data\n            // Configure the one-to-many relationship between Movie and MovieReview\n            // Each MovieReview has one Movie\n            // Each Movie can have many MovieReviews\n            // Foreign key in MovieReview table\n\n            // _context.Entity(modelBuilder)\n            // .WithMany()\n            // .HasOne()\n            // .HasForeignKey();\n\n            \n             // Seed data for Movies\n                modelBuilder.Entity&lt;Movie&gt;().HasData(\n                    new Movie { MovieID = 1, Title = \"Inception\", Director = \"Christopher Nolan\"},\n                    new Movie { MovieID = 2, Title = \"The Matrix\", Director = \"The Wachowskis\" },\n                    new Movie { MovieID = 3, Title = \"The Shawshank Redemption\", Director = \"Frank Darabont\" },\n                    new Movie { MovieID = 4, Title = \"The Godfather\", Director = \"Francis Ford Coppola\" },\n                    new Movie { MovieID = 5, Title = \"The Dark Knight\", Director = \"Christopher Nolan\" }\n                );\n\n\n            base.OnModelCreating(modelBuilder);\n        }\n    }\n}\n"
    //                             },
    //                             {
    //                                 "type": "file",
    //                                 "name": "Movie.cs",
    //                                 "code": "using System.Collections.Generic;\nusing Microsoft.EntityFrameworkCore;\nusing Microsoft.AspNetCore;\nusing dotnetapp.Models;\nusing System;\nusing System.ComponentModel.DataAnnotations;\nusing System.ComponentModel.DataAnnotations.Schema;\n\nnamespace dotnetapp.Models\n{\n    // Write your Movie Class here...\n\n    public class Movie {\n        [Key]\n        public int MovieID{get;set;}\n\n         [Required]\n        public string Title{get;set;}\n        \n        [Required]\n        public string Director {get;set;}\n\n        \n        public ICollection&lt;MovieReview&gt; Reviews {get;set;}\n    }\n}"
    //                             },
    //                             {
    //                                 "type": "file",
    //                                 "name": "MovieReview.cs",
    //                                 "code": "using Microsoft.EntityFrameworkCore;\nusing Microsoft.AspNetCore;\nusing dotnetapp.Models;\nusing System;\n\nusing System.ComponentModel.DataAnnotations;\nusing System.ComponentModel.DataAnnotations.Schema;\nnamespace dotnetapp.Models\n{\n    // Write your MovieReview class here...\n\n    public class MovieReview {\n        [Key]\n        public int MovieReviewID{get;set;}\n\n        public int MovieID {get;set;}\n       \n       [Required]\n        public string ReviewerName {get;set;}\n        \n        [Required]\n        public int Rating {get;set;}\n\n        [ForeignKey(\"MovieID\")]\n        // [ForeignKey(Movie)]\n        public Movie Movie {get;set;}\n    }\n}"
    //                             }
    //                         ]
    //                     },
    //                     {
    //                         "type": "file",
    //                         "name": "Program.cs",
    //                         "code": "using dotnetapp.Models;\n\nvar builder = WebApplication.CreateBuilder(args);\n\n// Add services to the container.\nbuilder.Services.AddControllersWithViews();\n\n//builder.Services.AddDbContext&lt;ApplicationDbContext&gt;(o=&gt;o.UseSqlServer(builder.Configuration.GetConnectionString(DevConnection)));\n\nvar app = builder.Build();\n\n// Configure the HTTP request pipeline.\nif (!app.Environment.IsDevelopment())\n{\n    app.UseExceptionHandler(\"/Home/Error\");\n    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.\n    app.UseHsts();\n}\n\napp.UseHttpsRedirection();\napp.UseStaticFiles();\n\napp.UseRouting();\n\napp.UseAuthorization();\n\napp.MapControllerRoute(\n    name: \"default\",\n    pattern: \"{controller=Movie}/{action=AvailableMovies}/{id?}\");\n\napp.Run();"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "type": "directory",
    //                 "name": "TestProject",
    //                 "contents": []
    //             }
    //         ],
    //         "aiAnalysis": "null",
    //         "Test_Submitted_Time": "2025-01-10 | 06:24:12 PM",
    //         "SonarAddedTime": "2025-01-10 | 06:23:29 PM",
    //         "Differnce_In_Submission": "00:00:43 mins",
    //         "log": [
    //             "{\n  \"passed\": [],\n  \"failed\": [\n    \"Existence_of_review_and_delete_button_and_table_along_with_rows_in_available_movies_page\",\n    \"Existence_of_review_button_in_available_movies_page_and_heading_in_movie_review_form_page\",\n    \"Existence_of_delete_button_and_heading_in_delete_confirmation_page\"\n  ]\n}",
    //             "{\n  \"passed\": [\n    \"ApplicationDbContextContainsDbSetMovieProperty\",\n    \"ApplicationDbContextContainsDbSetMovieReviewProperty\",\n    \"DeleteMovieConfirmed_Post_Method_ValidMovieID_RemovesMovieFromDatabase\",\n    \"Movie_Properties_Director_ReturnExpectedDataTypes\",\n    \"Movie_Properties_Director_ReturnExpectedValues\",\n    \"Movie_Properties_MovieID_ReturnExpectedDataTypes\",\n    \"Movie_Properties_MovieID_ReturnExpectedValues\",\n    \"Movie_Properties_Title_ReturnExpectedDataTypes\",\n    \"Movie_Properties_Title_ReturnExpectedValues\",\n    \"MovieClassExists\",\n    \"MovieReview_Properties_MovieID_ReturnExpectedDataTypes\",\n    \"MovieReview_Properties_MovieReviewID_ReturnExpectedDataTypes\",\n    \"MovieReview_Properties_Returns_Movie_ExpectedValues\",\n    \"MovieReview_Properties_ReviewerName_ReturnExpectedDataTypes\",\n    \"MovieReviewExists\"\n  ],\n  \"failed\": [\n    {\n      \"testName\": \"ReviewForm_Post_Method_ThrowsException_With_Message\",\n      \"errorMessage\": \"Expected: <dotnetapp.Exceptions.MovieReviewException>\\r\\n  But was:  null\"\n    },\n    {\n      \"testName\": \"ReviewForm_Post_Method_ValidData_CreatesReviewAndRedirects\",\n      \"errorMessage\": \"Expected string length 5 but was 15. Strings differ at index 5.\\r\\n  Expected: \\\"Movie\\\"\\r\\n  But was:  \\\"MovieController\\\"\\r\\n  ----------------^\"\n    }\n  ]\n}"
    //         ],
    //         "TestCode": {
    //             "UnitTest1.cs": "using dotnetapp.Controllers;\nusing dotnetapp.Exceptions;\nusing dotnetapp.Models;\nusing Microsoft.AspNetCore.Mvc;\nusing Microsoft.EntityFrameworkCore;\nusing NUnit.Framework;\nusing System.Linq;\nusing System.Threading.Tasks;\n\nnamespace dotnetapp.Tests\n{\n    [TestFixture]\n    public class MovieControllerTests\n    {\n        private ApplicationDbContext _context;\n        private MovieReviewController _controller;\n\n        [SetUp]\n        public void Setup()\n        {\n            // Set up the test database context\n            var options = new DbContextOptionsBuilder&lt;ApplicationDbContext&gt;()\n                .UseInMemoryDatabase(databaseName: \"TestDatabase\")\n                .Options;\n            _context = new ApplicationDbContext(options);\n            _context.Database.EnsureCreated();\n\n            _controller = new MovieReviewController(_context);\n        }\n\n        [TearDown]\n        public void TearDown()\n        {\n            // Clean up the test database context\n            _context.Database.EnsureDeleted();\n            _context.Dispose();\n        }\n\n        [Test]\n        public async Task ReviewForm_Post_Method_ValidData_CreatesReviewAndRedirects()\n        {\n            // Arrange\n            var movie = new Movie\n            {\n                MovieID = 200,\n                Title = \"Inception\",\n                Director = \"Christopher Nolan\",\n            };\n            _context.Movies.Add(movie);\n            await _context.SaveChangesAsync();\n\n            var movieReview = new MovieReview\n            {\n                MovieID = movie.MovieID,\n                ReviewerName = \"John Doe\",\n                Rating = 3,\n            };\n\n            var movieReviewController = new MovieReviewController(_context);\n\n            // Act\n            var result = movieReviewController.ReviewForm(movie.MovieID, movieReview) as RedirectToActionResult;\n\n            // Assert\n            Assert.IsNotNull(result);\n            Assert.AreEqual(\"AvailableMovies\", result.ActionName);\n            Assert.AreEqual(\"Movie\", result.ControllerName);\n\n\n            // Verify the review is added to the database\n            var addedReview = await _context.MovieReviews.FirstOrDefaultAsync(r =&gt; r.MovieID == movie.MovieID &amp;&amp; r.ReviewerName == \"John Doe\");\n            Assert.IsNotNull(addedReview);\n            Assert.AreEqual(3, addedReview.Rating);\n        }\n\n    // This test checks if MovieReviewException throws the message \"The rating must be between 1 and 5.\" or not\n    // Test if ReviewForm action throws MovieReviewException with correct message when rating is out of valid range\n    [Test]\n    public void ReviewForm_Post_Method_ThrowsException_With_Message()\n    {\n        // Arrange\n        var movie = new Movie\n        {\n            MovieID = 200,\n            Title = \"Inception\",\n            Director = \"Christopher Nolan\",\n        };\n        _context.Movies.Add(movie);\n        _context.SaveChanges();\n    \n        var invalidReview = new MovieReview\n        {\n            Rating = 6, // Invalid rating\n            ReviewerName = \"John Doe\",\n        };\n    \n        var movieReviewController = new MovieReviewController(_context);\n    \n        // Act and Assert\n        var exception = Assert.Throws&lt;MovieReviewException&gt;(() =&gt;\n        {\n            movieReviewController.ReviewForm(movie.MovieID, invalidReview);\n        });\n    \n        // Assert\n        Assert.AreEqual(\"The rating must be between 1 and 5\", exception.Message);\n    }\n    \n\n        // This test checks the existence of the Movie class\n        [Test]\n        public void MovieClassExists()\n        {\n            // Arrange\n            var movie = new Movie();\n\n            // Assert\n            Assert.IsNotNull(movie);\n        }\n\n        // This test checks the existence of the Class class\n        [Test]\n        public void MovieReviewExists()\n        {\n            // Arrange\n            var classEntity = new MovieReview();\n\n            // Assert\n            Assert.IsNotNull(classEntity);\n        }\n \n //This test check the exists of ApplicationDbContext class has DbSet of MovieReviews\n        [Test]\n        public void ApplicationDbContextContainsDbSetMovieReviewProperty()\n        {\n\n            var propertyInfo = _context.GetType().GetProperty(\"MovieReviews\");\n        \n            Assert.IsNotNull(propertyInfo);\n            Assert.AreEqual(typeof(DbSet&lt;MovieReview&gt;), propertyInfo.PropertyType);\n                   \n        }\n\n        //This test check the exists of ApplicationDbContext class has DbSet of MovieReviews\n        [Test]\n        public void ApplicationDbContextContainsDbSetMovieProperty()\n        {\n\n            var propertyInfo = _context.GetType().GetProperty(\"Movies\");\n        \n            Assert.IsNotNull(propertyInfo);\n            Assert.AreEqual(typeof(DbSet&lt;Movie&gt;), propertyInfo.PropertyType);\n                   \n        }\n    //     // This test checks the MovieID of Movie property is int\n       [Test]\n        public void Movie_Properties_MovieID_ReturnExpectedDataTypes()\n        {\n            Movie classEntity = new Movie();\n            Assert.That(classEntity.MovieID, Is.TypeOf&lt;int&gt;());\n        }\n\n      // This test checks the Title of Movie property is string\n        [Test]\n        public void Movie_Properties_Title_ReturnExpectedDataTypes()\n        {\n            // Arrange\n            Movie classEntity = new Movie { Title = \"Demo Title\" };\n\n            // Assert\n            Assert.That(classEntity.Title, Is.TypeOf&lt;string&gt;());\n        }\n\n      // This test checks the Director of Movie property is string\n        [Test]\n        public void Movie_Properties_Director_ReturnExpectedDataTypes()\n        {\n            // Arrange\n            Movie classEntity = new Movie { Director = \"Demo Director\" };\n\n            // Assert\n            Assert.That(classEntity.Director, Is.TypeOf&lt;string&gt;());\n        }\n\n       // This test checks the expected value of MovieID\n        [Test]\n        public void Movie_Properties_MovieID_ReturnExpectedValues()\n        {\n            // Arrange\n            int expectedMovieID = 100;\n\n            Movie classEntity = new Movie\n            {\n                MovieID = expectedMovieID\n            };\n            Assert.AreEqual(expectedMovieID, classEntity.MovieID);\n        }\n\n        // This test checks the expected value of Title\n        [Test]\n        public void Movie_Properties_Title_ReturnExpectedValues()\n        {\n            string expectedTitle= \"Demo Title\";\n\n            Movie classEntity = new Movie\n            {\n                Title = expectedTitle\n            };\n            Assert.AreEqual(expectedTitle, classEntity.Title);\n        }\n\n         // This test checks the expected value of Director\n        [Test]\n        public void Movie_Properties_Director_ReturnExpectedValues()\n        {\n            string expectedDirector = \"Demo Director\";\n\n            Movie classEntity = new Movie\n            {\n                Director = expectedDirector\n            };\n            Assert.AreEqual(expectedDirector, classEntity.Director);\n        }\n\n\n        // This test checks the expected value of MovieReviewID in MovieReview class is int\n        [Test]\n        public void MovieReview_Properties_MovieReviewID_ReturnExpectedDataTypes()\n        {\n            MovieReview moviereview = new MovieReview();\n            Assert.That(moviereview.MovieReviewID, Is.TypeOf&lt;int&gt;());\n        }\n\n        // This test checks the expected value of ReviewerName in MovieReview class is string\n        [Test]\n        public void MovieReview_Properties_ReviewerName_ReturnExpectedDataTypes()\n        {\n            MovieReview moviereview = new MovieReview();\n            moviereview.ReviewerName = \"John\";\n            Assert.That(moviereview.ReviewerName, Is.TypeOf&lt;string&gt;());\n        }\n\n        // This test checks the expected value of VRExperienceID in Attendee class is int\n        [Test]\n        public void MovieReview_Properties_MovieID_ReturnExpectedDataTypes()\n        {\n            MovieReview moviereview = new MovieReview();\n            Assert.That(moviereview.MovieID, Is.TypeOf&lt;int&gt;());\n        }\n\n        [Test]\n        public void MovieReview_Properties_Returns_Movie_ExpectedValues()\n        {\n            // Arrange\n            var expectedMovie = new Movie\n            {\n                MovieID = 1,\n                Title = \"Sample Movie\",\n                Director = \"Sample Director\",\n            };\n\n            var movieReview = new MovieReview\n            {\n                Movie = expectedMovie\n            };\n\n            // Act &amp; Assert\n            Assert.AreEqual(expectedMovie, movieReview.Movie);\n        }\n\n\n        [Test]\n        public async Task DeleteMovieConfirmed_Post_Method_ValidMovieID_RemovesMovieFromDatabase()\n        {\n            // Arrange\n            // Create a new Movie instance\n            var movie = new Movie \n            { \n                MovieID = 100, \n                Title = \"Test Movie\", \n                Director = \"Test Director\", \n            };\n            \n            // Add the movie to the context\n            _context.Movies.Add(movie);\n            await _context.SaveChangesAsync();\n            \n            // Create an instance of the MovieController\n            var controller = new MovieController(_context);\n\n            // Act\n            // Call the DeleteMovieConfirmed action\n            var result = await controller.DeleteMovieConfirmed(movie.MovieID) as RedirectToActionResult;\n\n            // Assert\n            Assert.IsNotNull(result);\n            Assert.AreEqual(\"AvailableMovies\", result.ActionName); // Check if redirected to AvailableMovies action\n\n            // Check if the movie was removed from the database\n            var deletedMovie = await _context.Movies.FindAsync(movie.MovieID);\n            Assert.IsNull(deletedMovie);\n        }\n     }\n }"
    //         }
    //     },
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
    //         "aiAnalysis": "null",
    //         "Test_Submitted_Time": "2025-01-17 | 04:41:55 PM",
    //         "SonarAddedTime": "2025-01-17 | 04:40:37 PM",
    //         "Differnce_In_Submission": "00:01:18 mins",
    //         "log": [
    //             "{\n  \"passed\": [\n    \"BookingModel_HasAllProperties\",\n    \"CustomerBooking_Relationship_IsConfiguredCorrectly\",\n    \"CustomerModel_HasAllProperties\",\n    \"DbContext_HasDbSetProperties\",\n    \"GetCustomerById_InvalidId_ReturnsNotFound\",\n    \"UpdateBooking_InvalidId_ReturnsNotFound\"\n  ],\n  \"failed\": [\n    {\n      \"testName\": \"CreateBooking_ReturnsCreatedBookingWithCustomerDetails\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Response status code does not indicate success: 500 (Internal Server Error).\"\n    },\n    {\n      \"testName\": \"CreateBooking_ThrowsRoomNumberException_ForZeroOrNegativeRoomNumber\",\n      \"errorMessage\": \"Expected: InternalServerError\\r\\n  But was:  MethodNotAllowed\"\n    },\n    {\n      \"testName\": \"CreateBooking_ThrowsRoomNumberException_ForZeroRoomNumber\",\n      \"errorMessage\": \"Expected: InternalServerError\\r\\n  But was:  MethodNotAllowed\"\n    },\n    {\n      \"testName\": \"CreateCustomer_ReturnsCreatedCustomer\",\n      \"errorMessage\": \"Expected: Created\\r\\n  But was:  InternalServerError\"\n    },\n    {\n      \"testName\": \"GetBookings_ReturnsListOfBookingsWithCustomers\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Response status code does not indicate success: 500 (Internal Server Error).\"\n    },\n    {\n      \"testName\": \"GetCustomerById_ReturnsCustomer\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Response status code does not indicate success: 500 (Internal Server Error).\"\n    },\n    {\n      \"testName\": \"GetCustomersSortedByName_ReturnsSortedCustomers\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Response status code does not indicate success: 500 (Internal Server Error).\"\n    },\n    {\n      \"testName\": \"UpdateBooking_ReturnsNoContent\",\n      \"errorMessage\": \"System.Net.Http.HttpRequestException : Response status code does not indicate success: 500 (Internal Server Error).\"\n    }\n  ]\n}"
    //         ],
    //         "TestCode": {
    //             "UnitTest1.cs": "using NUnit.Framework;\nusing System.Net;\nusing System.Text;\nusing System.Threading.Tasks;\nusing Microsoft.EntityFrameworkCore;\nusing dotnetapp.Data;\nusing dotnetapp.Models;\nusing System;\nusing System.Net.Http;\nusing System.Text;\nusing System.Threading.Tasks;\nusing Newtonsoft.Json;\nusing dotnetapp.Exceptions;\nusing System.Buffers;\n\n\nnamespace dotnetapp.Tests\n{\n    [TestFixture]\n    public class HotelControllerTests\n    {\n        private DbContextOptions&lt;ApplicationDbContext&gt; _dbContextOptions;\n        private ApplicationDbContext _context;\n        private HttpClient _httpClient;\n\n        [SetUp]\n        public void Setup()\n        {\n            _httpClient = new HttpClient();\n            _httpClient.BaseAddress = new Uri(\"http://localhost:8080\"); // Base URL of your API\n            _dbContextOptions = new DbContextOptionsBuilder&lt;ApplicationDbContext&gt;()\n                .UseInMemoryDatabase(databaseName: \"TestDatabase\")\n                .Options;\n\n            _context = new ApplicationDbContext(_dbContextOptions);\n        }\n\n       private async Task&lt;int&gt; CreateTestCustomerAndGetId()\n        {\n            var newCustomer = new Customer\n            {\n                Name = \"Test Customer\",\n                Email = \"test@example.com\",\n                PhoneNumber = \"9876543210\"\n            };\n\n            var json = JsonConvert.SerializeObject(newCustomer);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            var response = await _httpClient.PostAsync(\"api/Customer\", content);\n            response.EnsureSuccessStatusCode();\n\n            var createdCustomer = JsonConvert.DeserializeObject&lt;Customer&gt;(await response.Content.ReadAsStringAsync());\n            return createdCustomer.CustomerId;\n        }\n\n\n       [Test]\n        public async Task CreateCustomer_ReturnsCreatedCustomer()\n        {\n            // Arrange\n            var newCustomer = new Customer\n            {\n                Name = \"Test Customer\",\n                Email = \"test@example.com\",\n                PhoneNumber = \"9876543210\"\n            };\n\n            var json = JsonConvert.SerializeObject(newCustomer);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Customer\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            var createdCustomer = JsonConvert.DeserializeObject&lt;Customer&gt;(responseContent);\n\n            Assert.IsNotNull(createdCustomer);\n            Assert.AreEqual(newCustomer.Name, createdCustomer.Name);\n            Assert.AreEqual(newCustomer.Email, createdCustomer.Email);\n            Assert.AreEqual(newCustomer.PhoneNumber, createdCustomer.PhoneNumber);\n\n            var locationHeader = response.Headers.Location.ToString();\n            Assert.IsTrue(locationHeader.Contains(createdCustomer.CustomerId.ToString()));\n\n            // Optionally, verify the data by fetching it again\n            var fetchedResponse = await _httpClient.GetAsync(locationHeader);\n            Assert.AreEqual(HttpStatusCode.OK, fetchedResponse.StatusCode);\n            var fetchedContent = await fetchedResponse.Content.ReadAsStringAsync();\n            var fetchedCustomer = JsonConvert.DeserializeObject&lt;Customer&gt;(fetchedContent);\n\n            Assert.IsNotNull(fetchedCustomer);\n            Assert.AreEqual(createdCustomer.CustomerId, fetchedCustomer.CustomerId);\n        }\n\n\n       [Test]\n        public async Task GetCustomersSortedByName_ReturnsSortedCustomers()\n        {\n            // Act\n            var response = await _httpClient.GetAsync(\"api/Customer/SortedByName\");\n\n            // Assert\n            response.EnsureSuccessStatusCode();\n            var customers = JsonConvert.DeserializeObject&lt;Customer[]&gt;(await response.Content.ReadAsStringAsync());\n            Assert.IsNotNull(customers);\n            Assert.AreEqual(customers.OrderBy(c =&gt; c.Name).ToList(), customers);\n        }\n\n        [Test]\n        public async Task CreateBooking_ReturnsCreatedBookingWithCustomerDetails()\n        {\n            // Arrange\n            int customerId = await CreateTestCustomerAndGetId(); // Dynamically create a valid Customer\n\n            var newBooking = new Booking\n            {\n                BookingDate = \"2024-05-15\",\n                NumberOfRooms = 4,\n                CustomerId = customerId\n            };\n\n            var json = JsonConvert.SerializeObject(newBooking);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Booking\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.Created, response.StatusCode);\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            var createdBooking = JsonConvert.DeserializeObject&lt;Booking&gt;(responseContent);\n\n            Assert.IsNotNull(createdBooking);\n            Assert.AreEqual(newBooking.BookingDate, createdBooking.BookingDate);\n            Assert.AreEqual(newBooking.NumberOfRooms, createdBooking.NumberOfRooms);\n        }\n\n      [Test]\n        public async Task GetCustomerById_ReturnsCustomer()\n        {\n            // Arrange\n            int customerId = await CreateTestCustomerAndGetId(); // Create a customer and get its ID\n\n            // Act: Get the customer by ID and verify the response\n            var response = await _httpClient.GetAsync($\"api/Customer/{customerId}\");\n            Assert.AreEqual(HttpStatusCode.OK, response.StatusCode); // Check if the response is OK\n\n            // Deserialize the customer object from the response\n            var customer = JsonConvert.DeserializeObject&lt;Customer&gt;(await response.Content.ReadAsStringAsync());\n\n            // Assert: Customer object should not be null\n            Assert.IsNotNull(customer);\n        }\n\n\n\n        [Test]\n        public async Task UpdateBooking_ReturnsNoContent()\n        {\n            // Arrange\n            int customerId = await CreateTestCustomerAndGetId();\n            var newBooking = new Booking\n            {\n                BookingDate = \"2024-06-25\",\n                NumberOfRooms = 4,\n                CustomerId = customerId\n            };\n\n            var json = JsonConvert.SerializeObject(newBooking);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            var response = await _httpClient.PostAsync(\"api/Booking\", content);\n            var createdBooking = JsonConvert.DeserializeObject&lt;Booking&gt;(await response.Content.ReadAsStringAsync());\n\n            var updatedBooking = new Booking\n            {\n                BookingId = createdBooking.BookingId,\n                BookingDate = DateTime.UtcNow.AddDays(1).ToString(\"yyyy-MM-dd\"),\n                NumberOfRooms = 6,\n                CustomerId = customerId\n            };\n\n            var updateJson = JsonConvert.SerializeObject(updatedBooking);\n            var updateContent = new StringContent(updateJson, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var updateResponse = await _httpClient.PutAsync($\"api/Booking/{createdBooking.BookingId}\", updateContent);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.NoContent, updateResponse.StatusCode);\n        }\n\n        [Test]\n        public async Task UpdateBooking_InvalidId_ReturnsNotFound()\n        {\n            // Arrange\n            var updatedBooking = new Booking\n            {\n                BookingId = 9999, // Non-existent ID\n                BookingDate = DateTime.UtcNow.ToString(\"yyyy-MM-dd\"),\n                NumberOfRooms = 6,\n            };\n\n            var json = JsonConvert.SerializeObject(updatedBooking);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PutAsync($\"api/Booking/{updatedBooking.BookingId}\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);\n        }\n\n\n        [Test]\n        public async Task GetBookings_ReturnsListOfBookingsWithCustomers()\n        {\n            // Act\n            var response = await _httpClient.GetAsync(\"api/Booking\");\n\n            // Assert\n            response.EnsureSuccessStatusCode();\n            var bookings = JsonConvert.DeserializeObject&lt;Booking[]&gt;(await response.Content.ReadAsStringAsync());\n\n            Assert.IsNotNull(bookings);\n            Assert.IsTrue(bookings.Length &gt; 0);\n            Assert.IsNotNull(bookings[0].Customer); // Ensure each booking has a customer loaded\n        }\n\n        [Test]\n        public async Task GetCustomerById_InvalidId_ReturnsNotFound()\n        {\n            // Act\n            var response = await _httpClient.GetAsync(\"api/Customer/999\");\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.NotFound, response.StatusCode);\n        }\n\n\n\n        [Test]\n        public void CustomerModel_HasAllProperties()\n        {\n            // Arrange\n            var customer = new Customer\n            {\n                CustomerId = 5,\n                Name = \"Jane Doe\",\n                Email = \"jane.doe@example.com\",\n                PhoneNumber = \"9876543210\",\n                Bookings = new List&lt;Booking&gt;() // Ensure the Bookings collection is properly initialized\n            };\n\n            // Act &amp; Assert\n            Assert.AreEqual(5, customer.CustomerId, \"CustomerId does not match.\");\n            Assert.AreEqual(\"Jane Doe\", customer.Name, \"Name does not match.\");\n            Assert.AreEqual(\"jane.doe@example.com\", customer.Email, \"Email does not match.\");\n            Assert.AreEqual(\"9876543210\", customer.PhoneNumber, \"PhoneNumber does not match.\");\n            Assert.IsNotNull(customer.Bookings, \"Bookings collection should not be null.\");\n            Assert.IsInstanceOf&lt;ICollection&lt;Booking&gt;&gt;(customer.Bookings, \"Bookings should be of type ICollection&lt;Booking&gt;.\");\n        }\n\n\n        [Test]\n        public void BookingModel_HasAllProperties()\n        {\n            // Arrange\n            var customer = new Customer\n            {\n                CustomerId = 5,\n                Name = \"Jane Doe\",\n                Email = \"jane.doe@example.com\",\n                PhoneNumber = \"9876543210\"\n            };\n\n            var booking = new Booking\n            {\n                BookingId = 100,\n                BookingDate = \"2024-09-12\",\n                NumberOfRooms = 6,\n                CustomerId = 5,\n                Customer = customer\n            };\n\n            // Act &amp; Assert\n            Assert.AreEqual(100, booking.BookingId, \"BookingId does not match.\");\n            Assert.AreEqual(\"2024-09-12\", booking.BookingDate, \"BookingDate does not match.\");\n            Assert.AreEqual(6, booking.NumberOfRooms, \"NumberOfRooms does not match.\");\n            Assert.AreEqual(5, booking.CustomerId, \"CustomerId does not match.\");\n            Assert.IsNotNull(booking.Customer, \"Customer should not be null.\");\n            Assert.AreEqual(customer.Name, booking.Customer.Name, \"Customer's Name does not match.\");\n        }\n\n\n        [Test]\n        public void DbContext_HasDbSetProperties()\n        {\n            // Assert that the context has DbSet properties for Customers and Bookings\n            Assert.IsNotNull(_context.Customers, \"Customers DbSet is not initialized.\");\n            Assert.IsNotNull(_context.Bookings, \"Bookings DbSet is not initialized.\");\n        }\n\n\n        [Test]\n        public void CustomerBooking_Relationship_IsConfiguredCorrectly()\n        {\n            // Check if the Customer to Booking relationship is configured as one-to-many\n            var model = _context.Model;\n            var customerEntity = model.FindEntityType(typeof(Customer));\n            var bookingEntity = model.FindEntityType(typeof(Booking));\n\n            // Assert that the foreign key relationship exists between Booking and Customer\n            var foreignKey = bookingEntity.GetForeignKeys().FirstOrDefault(fk =&gt; fk.PrincipalEntityType == customerEntity);\n\n            Assert.IsNotNull(foreignKey, \"Foreign key relationship between Booking and Customer is not configured.\");\n            Assert.AreEqual(\"CustomerId\", foreignKey.Properties.First().Name, \"Foreign key property name is incorrect.\");\n\n            // Check if the cascade delete behavior is set\n            Assert.AreEqual(DeleteBehavior.Cascade, foreignKey.DeleteBehavior, \"Cascade delete behavior is not set correctly.\");\n        }\n\n\n        [Test]\n        public async Task CreateBooking_ThrowsRoomNumberException_ForZeroOrNegativeRoomNumber()\n        {\n            // Arrange\n            var newBooking = new Booking\n            {\n                BookingDate = DateTime.UtcNow.ToString(\"yyyy-MM-dd\"),\n                NumberOfRooms = -6,\n                CustomerId = 5\n            };\n\n            var json = JsonConvert.SerializeObject(newBooking);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Booking\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.InternalServerError, response.StatusCode); // 500 for thrown exception\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            Assert.IsTrue(responseContent.Contains(\"Number of rooms must be greater than 0.\"), \"Expected error message not found in the response.\");\n        }\n\n        [Test]\n        public async Task CreateBooking_ThrowsRoomNumberException_ForZeroRoomNumber()\n        {\n            // Arrange\n            var newBooking = new Booking\n            {\n                BookingDate = DateTime.UtcNow.ToString(\"yyyy-MM-dd\"),\n                NumberOfRooms = 0,  // Invalid zero number of rooms\n                CustomerId = 5\n            };\n\n            var json = JsonConvert.SerializeObject(newBooking);\n            var content = new StringContent(json, Encoding.UTF8, \"application/json\");\n\n            // Act\n            var response = await _httpClient.PostAsync(\"api/Booking\", content);\n\n            // Assert\n            Assert.AreEqual(HttpStatusCode.InternalServerError, response.StatusCode); // 500 for thrown exception\n\n            var responseContent = await response.Content.ReadAsStringAsync();\n            Assert.IsTrue(responseContent.Contains(\"Number of rooms must be greater than 0.\"), \"Expected error message not found in the response.\");\n        }\n\n\n        [TearDown]\n        public void Cleanup()\n        {\n            _httpClient.Dispose();\n        }\n    }\n}"
    //         }
    //     },
    //     {
    //         "key": "ecbdcbaee321866183fdacdaone",
    //         "test_Id": "https://admin.ltimindtree.iamneo.ai/result?testId=U2FsdGVkX18smhU8yehZpe2nr0k635SjQGzP6TrB%2FO8kzu8mloUIRcqboUypyWvcMT9cfpmmjHXH%2Bceq3Rg706cFGiVbur%2BvkSOEzvfMyD3W3zC7mHhDpk%2BBka5bkPGZV5yD4kBehlTKagG1xixoeA%3D%3D",
    //         "name": "Rohit Patel",
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
    //         "aiAnalysis": "null",
    //         "Test_Submitted_Time": "2024-12-27 | 05:12:47 PM",
    //         "Differnce_In_Submission": "The difference is more than 5 minutes or not recorded on submission of test. Check manually for Latest Code",
    //         "log": [
    //             "{\n  \"passed\": [],\n  \"failed\": [],\n  \"errors\": [\n    [\n      \"    0 Error(s)\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(59,34): error CS1003: Syntax error, ',' expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(96,8): error CS1002: ; expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(98,9): error CS1519: Invalid token 'catch' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(102,13): error CS1519: Invalid token '=' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(102,34): error CS1001: Identifier expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(102,86): error CS1031: Type expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(102,86): error CS1001: Identifier expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(102,91): error CS1001: Identifier expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(103,47): error CS1519: Invalid token '(' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(103,48): error CS1031: Type expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(103,48): error CS8124: Tuple must contain at least two elements. [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(103,48): error CS1026: ) expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(103,48): error CS1519: Invalid token '\\\"@ProductID\\\"' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(103,70): error CS1519: Invalid token ')' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(106,26): error CS8124: Tuple must contain at least two elements. [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(106,26): error CS1026: ) expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(106,26): error CS1519: Invalid token '>' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(108,23): error CS1519: Invalid token '(' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(108,24): error CS8124: Tuple must contain at least two elements. [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(108,25): error CS1519: Invalid token ';' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(109,19): error CS1519: Invalid token '(' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(109,30): error CS8124: Tuple must contain at least two elements. [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(109,31): error CS1519: Invalid token ';' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(113,1): error CS1519: Invalid token '}' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(114,1): error CS1022: Type or namespace definition, or end-of-file expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(117,5): error CS1022: Type or namespace definition, or end-of-file expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(118,1): error CS8803: Top-level statements must precede namespace and type declarations. [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(117,6): error CS1003: Syntax error, 'try' expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(117,6): error CS1514: { expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(117,6): error CS1513: } expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(118,11): error CS1031: Type expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(118,12): error CS1514: { expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(125,5): error CS1022: Type or namespace definition, or end-of-file expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(126,1): error CS1022: Type or namespace definition, or end-of-file expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(59,34): error CS1003: Syntax error, ',' expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(96,8): error CS1002: ; expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(98,9): error CS1519: Invalid token 'catch' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(102,13): error CS1519: Invalid token '=' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(102,34): error CS1001: Identifier expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(102,86): error CS1031: Type expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(102,86): error CS1001: Identifier expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(102,91): error CS1001: Identifier expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(103,47): error CS1519: Invalid token '(' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(103,48): error CS1031: Type expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(103,48): error CS8124: Tuple must contain at least two elements. [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(103,48): error CS1026: ) expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(103,48): error CS1519: Invalid token '\\\"@ProductID\\\"' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(103,70): error CS1519: Invalid token ')' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(106,26): error CS8124: Tuple must contain at least two elements. [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(106,26): error CS1026: ) expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(106,26): error CS1519: Invalid token '>' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(108,23): error CS1519: Invalid token '(' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(108,24): error CS8124: Tuple must contain at least two elements. [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(108,25): error CS1519: Invalid token ';' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(109,19): error CS1519: Invalid token '(' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(109,30): error CS8124: Tuple must contain at least two elements. [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(109,31): error CS1519: Invalid token ';' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(113,1): error CS1519: Invalid token '}' in class, record, struct, or interface member declaration [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(114,1): error CS1022: Type or namespace definition, or end-of-file expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(117,5): error CS1022: Type or namespace definition, or end-of-file expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(118,1): error CS8803: Top-level statements must precede namespace and type declarations. [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(117,6): error CS1003: Syntax error, 'try' expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(117,6): error CS1514: { expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(117,6): error CS1513: } expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(118,11): error CS1031: Type expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(118,12): error CS1514: { expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(125,5): error CS1022: Type or namespace definition, or end-of-file expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"/home/coder/project/workspace/dotnetapp/Program.cs(126,1): error CS1022: Type or namespace definition, or end-of-file expected [/home/coder/project/workspace/dotnetapp/dotnetapp.csproj]\",\n      \"    34 Error(s)\"\n    ]\n  ]\n}"
    //         ],
    //         "TestCode": {}
    //     },
    //     {
    //         "key": "bbfaefdafbde321866084bbeadcbaedbone",
    //         "test_Id": "",
    //         "name": "Abdul Mohamed Ibrahim Gani",
    //         "tcList": [
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_Medicine_Class_Should_Exist",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_Medicine_Class_Properties_Should_Exist",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_AddMedicine_Method_Should_Exist",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_DisplayMedicinesBelowStock_Method_Should_Exist",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_UpdateMedicineDetails_Method_Should_Exist",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_DeleteMedicineAbovePricePerUnit_Method_Should_Exist",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_AddMedicine_Should_Insert_Record",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_DisplayMedicinesBelowStock_Should_Output_Records",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_UpdateMedicineDetails_Should_Modify_Record",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_DeleteMedicineAbovePricePerUnit_Should_Remove_Record",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_DisplayMedicinesBelowStock_Should_Handle_No_Records_Found",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_DeleteMedicineAbovePricePerUnit_Should_Handle_No_Record_Found",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "NUnit",
    //                 "name": "Test_UpdateMedicineDetails_Should_Handle_No_Record_Found",
    //                 "result": "Failure"
    //             }
    //         ],
    //         "QuestionData": "<p><strong>Problem Statement: </strong>Medicine Management System</p><p><br></p><p><strong>Objective:</strong></p><p>Develop a console-based C# application using ADO.NET to perform CRUD operations on the Medicines table in a SQL Server database. The application should enable users to<strong> add new medicine records, display medicines below a stock level, update medicine details, and delete medicines</strong> above a price threshold. Implement the application exclusively using a disconnected architecture with <strong>SqlDataAdapter, DataSet, and DataTable.</strong></p><p><br></p><p><strong>Folder Structure:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/7131508876-1\"></p><p><br></p><h3><strong>Table:</strong></h3><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/7131508876-2\"></p><p><br></p><h3><strong>Classes and Properties</strong></h3><p><strong>Medicine Class (Models/Medicine.cs):</strong></p><p>The <strong>Medicine</strong> class represents a medicine record with the following public properties:</p><ul><li><strong>MedicineID (int):</strong> Unique identifier for each medicine. Auto-incremented in the database.</li><li><strong>MedicineName (string):</strong> Name of the medicine</li><li><strong>Stock (int):</strong> Current stock level of the medicine.</li><li><strong>PricePerUnit (decimal):</strong> Price per unit of the medicine.</li><li><strong>Manufacturer (string):</strong> Manufacturer of the medicine</li></ul><p><strong>Access Modifier:</strong> public</p><p><br></p><p><strong>Database Details:</strong></p><ul><li>Database Name: <strong>appdb</strong></li><li>Table Name: <strong>Medicines</strong></li><li>Ensure that the database connection is properly established using the <strong>ConnectionStringProvider</strong> class in the file <strong>Program.cs.</strong></li><li>Use the below connection string to connect the MsSql Server</li><li class=\"ql-indent-1\">public static string <strong>ConnectionString </strong>{ get; } = \"User ID=sa;password=examlyMssql@123; server=localhost<strong>;</strong>Database=appdb;trusted_connection=false;Persist Security Info=False;Encrypt=False\";</li></ul><p><br></p><p><strong><u>To Work with SQLServer:</u></strong></p><p>(Open a New Terminal) type the below commands</p><p><strong>sqlcmd -U sa&nbsp;</strong></p><p>password:&nbsp;<strong>examlyMssql@123</strong></p><p>1&gt; create database appdb</p><p>2&gt;go</p><p><br></p><p>1&gt;use appdb</p><p>2&gt;go</p><p><br></p><p>1&gt; create table TableName(columnName datatype,...)</p><p>2&gt; go</p><p>&nbsp;</p><p>1&gt; insert into TableName values(\" \",\" \",....)</p><p>2&gt; go</p><p><br></p><p><strong>Methods:</strong></p><p>Define the following methods inside the <strong>Program </strong>class, located in the <strong>Program.cs </strong>file.</p><p><br></p><p>Methods:</p><p>All methods are defined in Program.cs:</p><h3><strong>1. AddMedicine(Medicine medicine)</strong></h3><p><strong>Purpose:</strong></p><p>Inserts a new medicine record into the Medicines table.</p><p><strong>Parameters:</strong></p><ul><li><strong>medicine</strong>: An object of the <strong>Medicine </strong>class containing details of the medicine to be added.</li></ul><p><strong>Access Modifier:</strong> public</p><p><strong>Declaration Modifier:</strong> static</p><p><strong>Return Type:</strong> void</p><p><strong>Console Messages:</strong></p><ul><li><strong>On success:</strong></li><li class=\"ql-indent-1\">Medicine added successfully.</li></ul><p><br></p><h3><strong>2. DisplayMedicinesBelowStock(int stockThreshold)</strong></h3><p><strong>Purpose:</strong></p><p>Fetches and displays medicines with stock below the specified threshold.</p><p><strong>Parameters:</strong></p><ul><li><strong>stockThreshold</strong>: The minimum stock level to filter records.</li></ul><p><strong>Access Modifier:</strong> public</p><p><strong>Declaration Modifier:</strong> static</p><p><strong>Return Type:</strong> void</p><p><strong>Console Messages:</strong></p><ul><li><strong>If records are found:</strong></li><li class=\"ql-indent-1\">MedicineID: {MedicineID}, Name: {MedicineName}, Stock: {Stock}, PricePerUnit: {PricePerUnit}, Manufacturer: {Manufacturer}</li><li><strong>If no records are found:</strong></li><li class=\"ql-indent-1\">No medicines found below the stock threshold.</li></ul><p><br></p><h3><strong>3. UpdateMedicineDetails(string medicineName, Medicine updatedMedicine)</strong></h3><p><strong>Purpose:</strong></p><p>Updates the details of an existing medicine record in the Medicines table.</p><p><strong>Parameters:</strong></p><ul><li><strong>medicineName</strong>: Name of the medicine to update.</li><li><strong>updatedMedicine</strong>: An object of the <strong>Medicine </strong>class with updated details.</li></ul><p><strong>Access Modifier:</strong> public</p><p><strong>Declaration Modifier:</strong> static</p><p><strong>Return Type:</strong> void</p><p><strong>Console Messages:</strong></p><ul><li><strong>On success:</strong></li><li class=\"ql-indent-1\">Medicine details updated successfully.</li><li><strong>If no record is found:</strong></li><li class=\"ql-indent-1\">No matching medicine found for the given name.</li></ul><p><br></p><h3><strong>4. DeleteMedicineAbovePricePerUnit(decimal priceThreshold)</strong></h3><p><strong>Purpose:</strong></p><p>Deletes medicines from the Medicines table if their PricePerUnit exceeds the specified threshold.</p><p><strong>Parameters:</strong></p><ul><li><strong>priceThreshold</strong>: Maximum price allowed.</li></ul><p><strong>Access Modifier:</strong> public</p><p><strong>Declaration Modifier:</strong> static</p><p><strong>Return Type:</strong> void</p><p><strong>Console Messages:</strong></p><ul><li><strong>On success:</strong></li><li class=\"ql-indent-1\">Medicines with PricePerUnit above {priceThreshold} have been deleted.</li><li><strong>If no record is found:</strong></li><li class=\"ql-indent-1\">No medicines found above the specified PricePerUnit threshold.</li></ul><p><br></p><p><strong>Main Menu:</strong></p><p>The main menu serves as the user interface for interacting with the system. It provides the following options:</p><p><br></p><p>Medicine Management Menu  </p><p>1. Add Medicine  </p><p>2. Display Medicines Below Stock Level  </p><p>3. Update Medicine Details  </p><p>4. Delete Medicine Above PricePerUnit  </p><p>5. Exit  </p><p>Enter your choice (1-5): </p><h3>Invalid choice - Displays \"Invalid choice.\"</h3><p><br></p><p><strong><u>Commands to Run the Project:</u></strong></p><ul><li><strong>cd dotnetapp -&nbsp;</strong>Select the dotnet project folder</li><li><strong>dotnet restore -&nbsp;</strong>This command will restore all the required packages to run the application.</li><li><strong>dotnet run -&nbsp;</strong>To run the application in port 8080 (The settings preloaded click <strong>PORT: 8080</strong> to View)</li><li><strong>dotnet build -&nbsp;</strong>To build and check for errors</li><li><strong>dotnet clean -&nbsp;</strong>If the same error persists clean the project and build again</li><li><strong>dotnet add package package_name --version 6.0 -&nbsp;</strong>Any package if required you can install by the above command. The package that you are installing should support the .Net 6.0 version.</li></ul><p><strong>Note:</strong></p><p><strong>1. Do not change the class names</strong>.&nbsp;</p><p>2. <strong>Do not change the skeleton</strong>&nbsp;(Structure of the project given).</p><p><br></p><p><strong>Refer to the Sample Output:</strong></p><p><br></p><p><strong>Add:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/7131508876-3\"></p><p><strong>Display:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/7131508876-4\"></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/7131508876-5\"></p><p><strong>Update:</strong></p><p><br></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/7131508876-6\"></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/7131508876-7\"></p><p><strong>Delete:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/7131508876-8\"></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/7131508876-9\"></p><p><strong>Invalid Choice:</strong></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/7131508876-10\"></p>",
    //         "codeComponents": [
    //             {
    //                 "type": "directory",
    //                 "name": "Models",
    //                 "contents": [
    //                     {
    //                         "type": "file",
    //                         "name": "Medicine.cs",
    //                         "code": "using System;\n\nnamespace dotnetapp.Models\n{\n    public class Medicine\n    {\n        public int MedicineID {get;set;}\n        public string MedicineName {get;set;}\n        public int Stock {get;set;}\n        public decimal PricePerUnit {get;set;}\n        public string Manufacturer {get;set;}\n        \n\n    }\n    \n}"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "type": "file",
    //                 "name": "Program.cs",
    //                 "code": "using System;\nusing System.Data;\nusing System.Data.SqlClient;\nusing dotnetapp.Models;\n\nnamespace dotnetapp\n{\n    public static class ConnectionStringProvider\n    {\n        public static string ConnectionString { get; } = \"User ID = sa;password=examlyMssql@123;server=localhost;Database=appdb;\";\n    }\n\n    public class Program\n    {\n        static string connectionString = ConnectionStringProvider.ConnectionString;\n\n        public static void Main(string[] args)\n        {\n          Console.WriteLine(\"Medicine Management System\");\n          Console.WriteLine(\"1. Add Medicine\");\n          Console.WriteLine(\"2. Display Medicines Below Stock Level\");\n          Console.WriteLine(\"3. Update Medicine Details \");\n          Console.WriteLine(\"4. Delete Medicine Above PricePerUnit\");\n          Console.WriteLine(\"5. Exit\");\n          Console.WriteLine(\"Enter your choice (1-5): \");\n          int choice = int.Parse(Console.ReadLine());\n          \n          switch(choice)\n          {\n          case 1:\n         \n         Console.WriteLine(\"Enter Medicine Name: \");\n         string MedicineName = Console.ReadLine();\n         Console.WriteLine(\"Enter Stock\");\n         int Stock= int.Parse(Console.ReadLine());\n         Console.WriteLine(\"Enter Price Per Unit: \");\n         decimal PricePerUnit = decimal.Parse(Console.ReadLine());\n         Console.WriteLine(\"Enter Manufacturer: \");\n         string Manufacturer = Console.ReadLine();\n         Medicine medicine = new Medicine(){MedicineName=MedicineName,Stock=Stock,PricePerUnit=PricePerUnit,Manufacturer=Manufacturer\n\n         };\n         AddMedicine(medicine);\n\n          break;\n\n          }\n          \n\n\n        }\n\n\n        public static void AddMedicine(Medicine medicine)\n        {\n         try{\n            using(SqlConnection connection = new SqlConnection(connectionString))\n            {\n                SqlDataAdapter adapter = new SqlDataAdapter(\"select * from Medicines where medicine \",connection);\n\n                DataSet dataSet = new DataSet();\n                adapter.Fill(dataSet,\"Medicines\");\n                DataTable MedicinesTables = dataSet.Tables[\"Medicines\"];\n                DataRow newRow = MedicinesTables.NewRow();\n                newRow[\"MedicineID\"] = medicine.MedicineID;\n                newRow[\"MedicineName\"] = medicine.MedicineName;\n                newRow[\"Stock\"] = medicine.Stock;\n                newRow[\"PricePerUnit\"] = medicine.PricePerUnit;\n                newRow[\"Manufacturer\"] = medicine.Manufacturer;\n                MedicinesTables.Rows.Add(newRow);\n                SqlCommandBuilder builder = new SqlCommandBuilder(adapter);\n                adapter.Update(dataSet,\"Medicines\");\n                Console.WriteLine(\"Medicine added successfully\");\n            }\n         }\n         catch(SqlException ex)\n         {\n            Console.WriteLine(ex.Message);\n         }\n        }\n\n        public static void DisplayMedicinesBelowStock(int stockThreshold)\n        {\n\n        }\n\n        public static void UpdateMedicineDetails(string medicineName,Medicine updatedMedicine)\n        {\n\n        }\n\n\n        public static void DeleteMedicineAbovePricePerUnit(decimal priceThreshold)\n        {\n\n        }\n    }\n\n\n}"
    //             }
    //         ],
    //         "aiAnalysis": "null",
    //         "Test_Submitted_Time": "2024-12-27 | 05:25:04 PM",
    //         "SonarAddedTime": "2024-12-27 | 05:23:32 PM",
    //         "Differnce_In_Submission": "00:01:32 mins",
    //         "log": [
    //             "{\n  \"passed\": [\n    \"Test_Medicine_Class_Should_Exist\",\n    \"Test_Medicine_Class_Properties_Should_Exist\",\n    \"Test_AddMedicine_Method_Should_Exist\",\n    \"Test_DisplayMedicinesBelowStock_Method_Should_Exist\",\n    \"Test_UpdateMedicineDetails_Method_Should_Exist\",\n    \"Test_DeleteMedicineAbovePricePerUnit_Method_Should_Exist\"\n  ],\n  \"failed\": [\n    {\n      \"testName\": \"Test_AddMedicine_Should_Insert_Record\",\n      \"errorMessage\": \"The success message should be displayed.\\r\\n  Expected: True\\r\\n  But was:  False\"\n    },\n    {\n      \"testName\": \"Test_DisplayMedicinesBelowStock_Should_Output_Records\",\n      \"errorMessage\": \"Expected: True\\r\\n  But was:  False\"\n    },\n    {\n      \"testName\": \"Test_UpdateMedicineDetails_Should_Modify_Record\",\n      \"errorMessage\": \"The update message should be displayed.\\r\\n  Expected: True\\r\\n  But was:  False\"\n    },\n    {\n      \"testName\": \"Test_DeleteMedicineAbovePricePerUnit_Should_Remove_Record\",\n      \"errorMessage\": \"Medicine should be deleted from the database.\\r\\n  Expected: 0\\r\\n  But was:  1\"\n    },\n    {\n      \"testName\": \"Test_DisplayMedicinesBelowStock_Should_Handle_No_Records_Found\",\n      \"errorMessage\": \"Message 'No medicines found' should be displayed.\\r\\n  Expected: True\\r\\n  But was:  False\"\n    },\n    {\n      \"testName\": \"Test_DeleteMedicineAbovePricePerUnit_Should_Handle_No_Record_Found\",\n      \"errorMessage\": \"Expected: True\\r\\n  But was:  False\"\n    },\n    {\n      \"testName\": \"Test_UpdateMedicineDetails_Should_Handle_No_Record_Found\",\n      \"errorMessage\": \"Message 'No matching medicine found' should be displayed.\\r\\n  Expected: True\\r\\n  But was:  False\"\n    }\n  ]\n}"
    //         ],
    //         "TestCode": {}
    //     },
    //     {
    //         "key": "efcdaadedbbde322225778dfddababccfeebone",
    //         "test_Id": "https://admin.ltimindtree.iamneo.ai/result?testId=U2FsdGVkX1%2Bxw01VMx0VDteMV%2BKHbBJR%2FT2xB%2F2w4mqhJSf5%2BNziwbyHzl%2B85LHJuXgDfxGqXyzCcguIV3b9AOwOrASOEp%2F716jgrk3etQu%2BYOmLwabC5XgtTIc1nkBc78zpRIq4zuEpy0Ar1Tonqg%3D%3D",
    //         "name": "Ankit Kumar",
    //         "tcList": [
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testAddDepartment",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testAddEmployee",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testGetDepartmentById",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testgetAllEmployees",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testDeleteEmployee",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testDuplicateException",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testMethodHasQueryAnnotation",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testOneToManyAnnotationPresent",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testControllerFolder",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testDepartmentControllerFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testEmployeeControllerFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testModelFolder",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testDepartmentModelFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testEmployeeModelFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testRepositoryFolder",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testDepartmentRepositoryFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testEmployeeRepositoryFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testServiceFolder",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testDepartmentServiceFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testEmployeeServiceFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testEmployeeServiceImplFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testEmployeeServiceImplFile",
    //                 "result": "Success"
    //             }
    //         ],
    //         "QuestionData": "<p><strong>Overview:</strong></p><p>Create a Spring Boot application with two entities: \"Department\" and \"Employee\". A department can have multiple employees, and a employee can belong to only one department.  Implement a one-to-many bidirectional mapping between these entities using Spring JPA. <span style=\"color: rgb(51, 51, 51);\">Utilize JPQL for retrieving details and incorporating handling for DuplicateDepartmentException.</span></p><p><br></p><p><strong>Functional Requirements:</strong></p><p>Create folders named controller, model, repository, exception, and service inside the<strong> WORKSPACE/springapp/src/main/java/com/examly/springapp</strong>.</p><p>Inside the controller folder, create classes named <strong>\"DepartmentController” </strong>and <strong>\"EmployeeController\".</strong></p><p>Inside the model folder,</p><p>Create a class named <strong>\"Department\"</strong> with the following attributes:</p><ol><li>id  - int(auto-generated primary key)</li><li>departmentName - String</li><li>visionStatement - String</li><li>employees - List&lt;Employee&gt; (OneToMany, mappedBy = \"department\", JsonManagedReference)</li></ol><p>Create another class named <strong>\"Employee\"</strong> with the following attributes:</p><ol><li>employeeId - int(auto-generated primary key)</li><li>name - String</li><li>salary - double</li><li>designation - String</li><li>department - Department (ManyToOne, JsonBackReference)</li></ol><p>Implement getters, setters and constructors<span style=\"color: rgb(51, 51, 51);\"> (both parameterized and no-argument)</span> for the Team and Player entities.</p><p>Inside the repository folder, create interfaces named <strong>“DepartmentRepo”</strong> and  <strong>\"EmployeeRepo\"</strong>.</p><p><span style=\"color: rgb(51, 51, 51);\">Inside the service folder, create interfaces named </span><strong style=\"color: rgb(51, 51, 51);\">\"DepartmentService\" </strong><span style=\"color: rgb(51, 51, 51);\">and </span><strong style=\"color: rgb(51, 51, 51);\">\"EmployeeService\"</strong><span style=\"color: rgb(51, 51, 51);\">.</span></p><p>Inside the exception folder, create class named <strong>\"</strong><strong style=\"color: rgb(51, 51, 51);\">DuplicateDepartmentException\"</strong>.</p><p><span style=\"color: rgb(51, 51, 51);\">Inside the service folder</span>, create classes <strong>DepartmentServiceImpl </strong>and<strong> EmployeeServiceImpl </strong>which implement <strong>DepartmentService</strong>  and <strong>EmployeeService.</strong></p><p><br></p><p>Refer to the below image for the project structure:</p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/3853628839-1\"></p><p><br></p><p><strong>﻿API ENDPOINTS:</strong></p><p><strong>POST - \"/department\"</strong> - Returns response status 201 with department object on successful creation,<span style=\"color: rgb(51, 51, 51);\"> In case of a </span><strong style=\"color: rgb(51, 51, 51);\">DuplicateDepartmentException</strong><span style=\"color: rgb(51, 51, 51);\">, specifically when the department name already exists, it returns a status of 500 with an appropriate error message as \"Department with name {departmentName} already exists!\".</span></p><p><strong>POST - \"/employee/{departmentId}/department\"</strong> - Returns response status 201 with a employee object on successfully mapping the employee to the departmentId or else 500.</p><p><strong>GET - \"/department/{departmentId}\"</strong> - Returns response status 200 with department object, which includes details of employees on successful retrieval or else 404.</p><p><strong>GET - \"/employee\"</strong> -  Returns a response status 200 with a List&lt;Employee&gt; object on <span style=\"color: rgb(51, 51, 51);\">successful retrieval or else returns 404. </span></p><p><strong style=\"color: rgb(51, 51, 51);\">GET - \"/employee/salary\"</strong><span style=\"color: rgb(51, 51, 51);\"> -  Returns a response status 200 with a List&lt;Employee&gt; object sorted by salary in descending order on successful retrieval, or a response status 404 if no employees are found. Use the </span><strong style=\"color: rgb(51, 51, 51);\">@Query</strong><span style=\"color: rgb(51, 51, 51);\"> annotation in respective Repository class to get these details.</span></p><p><strong>DELETE - \"/employee/{employeeId}\"</strong> - Returns response status 200 with String \"Employee +<span style=\"color: rgb(51, 51, 51);\">employeeId</span>+ deleted successfully\" on successful deletion or else \"Employee not found with ID: \" + employeeId.</p><p><br></p><p><strong>Platform Guidelines:</strong></p><p>To run the project use Terminal in the platform.</p><p><br></p><p><strong>Spring Boot:</strong></p><p>Navigate to the springapp directory =&gt; cd springapp</p><p>To start/run the application 'mvn spring-boot:run'</p><p><br></p><p><strong>To Connect the Database Open the terminal</strong></p><p>mysql -u root --protocol=tcp -p</p><p>password:examly</p><p><br></p><p><strong>NOTE:</strong></p><p>Click on the Run Test Case button to pass all the test cases</p>",
    //         "codeComponents": [
    //             {
    //                 "type": "directory",
    //                 "name": "springapp/src/main",
    //                 "contents": [
    //                     {
    //                         "type": "directory",
    //                         "name": "java/com/examly/springapp",
    //                         "contents": [
    //                             {
    //                                 "type": "directory",
    //                                 "name": "controller",
    //                                 "contents": [
    //                                     {
    //                                         "type": "file",
    //                                         "name": "DepartmentController.java",
    //                                         "code": "package com.examly.springapp.controller;\n\nimport org.springframework.beans.factory.annotation.Autowired;\nimport org.springframework.http.ResponseEntity;\nimport org.springframework.web.bind.annotation.GetMapping;\nimport org.springframework.web.bind.annotation.PathVariable;\nimport org.springframework.web.bind.annotation.PostMapping;\nimport org.springframework.web.bind.annotation.RequestBody;\nimport org.springframework.web.bind.annotation.RestController;\n\nimport com.examly.springapp.exception.DuplicateDepartmentException;\nimport com.examly.springapp.model.Department;\nimport com.examly.springapp.service.DepartmentServiceImpl;\n\nimport jakarta.persistence.EntityNotFoundException;\n\n@RestController\npublic class DepartmentController {\n    \n    @Autowired\n    private DepartmentServiceImpl departmentServiceImpl;\n\n    @PostMapping(\"/department\")\n    public ResponseEntity&lt;?&gt; addDepartment(@RequestBody Department department){\n\n        try {\n            Department savedDepartment = departmentServiceImpl.addDepartment(department);\n            return ResponseEntity.status(201).body(savedDepartment);\n        } catch (DuplicateDepartmentException e) {\n            return ResponseEntity.status(500).body(\"Department with name \"+ department.getDepartmentName()+ \" already exists!\");\n        }catch(Exception e){\n            return ResponseEntity.status(500).body(\"Department with name \"+ department.getDepartmentName()+ \" already exists!\");\n        }\n    }\n\n    @GetMapping(\"/department/{departmentId}\")\n    public ResponseEntity&lt;?&gt; getDepartmentById(@PathVariable int departmentId){\n\n        try {\n            Department savedDepartment = departmentServiceImpl.getDepartment(departmentId);\n            return ResponseEntity.status(200).body(savedDepartment);\n        } catch (EntityNotFoundException e) {\n            return ResponseEntity.status(404).body(\"null\");\n        }\n    }\n\n\n    \n    \n\n}\n"
    //                                     },
    //                                     {
    //                                         "type": "file",
    //                                         "name": "EmployeeController.java",
    //                                         "code": "package com.examly.springapp.controller;\n\npublic class EmployeeController {\n    \n}\n"
    //                                     }
    //                                 ]
    //                             },
    //                             {
    //                                 "type": "directory",
    //                                 "name": "exception",
    //                                 "contents": [
    //                                     {
    //                                         "type": "file",
    //                                         "name": "DuplicateDepartmentException.java",
    //                                         "code": "package com.examly.springapp.exception;\n\npublic class DuplicateDepartmentException extends RuntimeException{\n    \n    \n}\n"
    //                                     }
    //                                 ]
    //                             },
    //                             {
    //                                 "type": "directory",
    //                                 "name": "model",
    //                                 "contents": [
    //                                     {
    //                                         "type": "file",
    //                                         "name": "Department.java",
    //                                         "code": "package com.examly.springapp.model;\n\nimport java.util.List;\n\nimport com.fasterxml.jackson.annotation.JsonManagedReference;\n\nimport jakarta.persistence.Entity;\nimport jakarta.persistence.GeneratedValue;\nimport jakarta.persistence.GenerationType;\nimport jakarta.persistence.Id;\nimport jakarta.persistence.OneToMany;\n\n@Entity\npublic class Department {\n\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private int id;\n    private String departmentName;\n    private String visionStatement;\n\n    @OneToMany(mappedBy = \"department\")\n    @JsonManagedReference\n    List&lt;Employee&gt; employees;\n\n    public Department() {\n    }\n\n    public Department(int id, String departmentName, String visionStatement, List&lt;Employee&gt; employees) {\n        this.id = id;\n        this.departmentName = departmentName;\n        this.visionStatement = visionStatement;\n        this.employees = employees;\n    }\n\n    public int getId() {\n        return id;\n    }\n\n    public void setId(int id) {\n        this.id = id;\n    }\n\n    public String getDepartmentName() {\n        return departmentName;\n    }\n\n    public void setDepartmentName(String departmentName) {\n        this.departmentName = departmentName;\n    }\n\n    public String getVisionStatement() {\n        return visionStatement;\n    }\n\n    public void setVisionStatement(String visionStatement) {\n        this.visionStatement = visionStatement;\n    }\n\n    public List&lt;Employee&gt; getEmployees() {\n        return employees;\n    }\n\n    public void setEmployees(List&lt;Employee&gt; employees) {\n        this.employees = employees;\n    }\n\n    @Override\n    public String toString() {\n        return \"Department [id=\" + id + \", DepartmentName=\" + departmentName + \", visionStatement=\" + visionStatement\n                + \", employees=\" + employees + \"]\";\n    }\n}\n"
    //                                     },
    //                                     {
    //                                         "type": "file",
    //                                         "name": "Employee.java",
    //                                         "code": "package com.examly.springapp.model;\n\nimport com.fasterxml.jackson.annotation.JsonBackReference;\n\nimport jakarta.persistence.Entity;\nimport jakarta.persistence.GeneratedValue;\nimport jakarta.persistence.GenerationType;\nimport jakarta.persistence.Id;\nimport jakarta.persistence.ManyToOne;\n\n@Entity\npublic class Employee {\n    \n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private int employeeId;\n    private String name;\n    private double salary;\n    private String designation;\n\n    @ManyToOne\n    @JsonBackReference\n    Department department;\n\n    public int getEmployeeId() {\n        return employeeId;\n    }\n\n    public void setEmployeeId(int employeeId) {\n        this.employeeId = employeeId;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public void setName(String name) {\n        this.name = name;\n    }\n\n    public double getSalary() {\n        return salary;\n    }\n\n    public void setSalary(double salary) {\n        this.salary = salary;\n    }\n\n    public String getDesignation() {\n        return designation;\n    }\n\n    public void setDesignation(String designation) {\n        this.designation = designation;\n    }\n\n    public Department getDepartment() {\n        return department;\n    }\n\n    public void setDepartment(Department department) {\n        this.department = department;\n    }\n\n    public Employee() {\n    }\n\n    public Employee(int employeeId, String name, double salary, String designation, Department department) {\n        this.employeeId = employeeId;\n        this.name = name;\n        this.salary = salary;\n        this.designation = designation;\n        this.department = department;\n    }\n\n    @Override\n    public String toString() {\n        return \"Employee [employeeId=\" + employeeId + \", name=\" + name + \", salary=\" + salary + \", designation=\"\n                + designation + \", department=\" + department + \"]\";\n    }\n\n}"
    //                                     }
    //                                 ]
    //                             },
    //                             {
    //                                 "type": "directory",
    //                                 "name": "repository",
    //                                 "contents": [
    //                                     {
    //                                         "type": "file",
    //                                         "name": "DepartmentRepo.java",
    //                                         "code": "package com.examly.springapp.repository;\n\nimport java.util.Optional;\n\nimport org.springframework.data.jpa.repository.JpaRepository;\nimport org.springframework.data.jpa.repository.Query;\nimport org.springframework.stereotype.Repository;\n\nimport com.examly.springapp.model.Department;\n\n@Repository\npublic interface DepartmentRepo extends JpaRepository&lt;Department, Integer&gt; {\n\n    // @Query(SELECT DepartmentName FROM Department d WHERE d.departmentName LIKE :departmentName)\n    // public Optional&lt;Department&gt; findByDepartmentName();\n    \n}\n"
    //                                     },
    //                                     {
    //                                         "type": "file",
    //                                         "name": "EmployeeRepo.java",
    //                                         "code": "package com.examly.springapp.repository;\n\nimport org.springframework.data.jpa.repository.JpaRepository;\nimport org.springframework.stereotype.Repository;\n\nimport com.examly.springapp.model.Employee;\n\n@Repository\npublic interface EmployeeRepo extends JpaRepository&lt;Employee, Integer&gt; {\n    \n}\n"
    //                                     }
    //                                 ]
    //                             },
    //                             {
    //                                 "type": "directory",
    //                                 "name": "service",
    //                                 "contents": [
    //                                     {
    //                                         "type": "file",
    //                                         "name": "DepartmentService.java",
    //                                         "code": "package com.examly.springapp.service;\n\npublic interface DepartmentService {\n    \n}\n"
    //                                     },
    //                                     {
    //                                         "type": "file",
    //                                         "name": "DepartmentServiceImpl.java",
    //                                         "code": "package com.examly.springapp.service;\n\nimport java.util.List;\nimport java.util.Optional;\n\nimport org.springframework.beans.factory.annotation.Autowired;\nimport org.springframework.stereotype.Service;\n\nimport com.examly.springapp.exception.DuplicateDepartmentException;\nimport com.examly.springapp.model.Department;\nimport com.examly.springapp.repository.DepartmentRepo;\n\nimport jakarta.persistence.EntityNotFoundException;\n\n@Service\npublic class DepartmentServiceImpl implements DepartmentService{\n\n    @Autowired\n    private DepartmentRepo departmentRepo;\n    \n    public Department addDepartment(Department department) throws DuplicateDepartmentException{\n        \n        // if(departmentRepo.findAllById(department.getId()));\n\n        // if (department.getId() == ) {\n            \n        // }\n        departmentRepo.save(department);\n            return department;\n\n        int tempId = department.getId();\n        Optional&lt;Department&gt; optDepartment = departmentRepo.findById(tempId);\n        Department currentDepartment = optDepartment.get();\n        // int tempid2 = currentDepartment.getId();\n        \n        // if (!(optDepartment.isEmpty())) {\n        //     throw new DuplicateDepartmentException();\n        // }\n\n        if (optDepartment.isPresent()) {\n            throw new DuplicateDepartmentException();\n        }else{\n            \n        }\n\n        // if (tempid2 == tempId) {\n        //     throw new DuplicateDepartmentException();\n        // }\n\n        \n        // String tempName = department.getDepartmentName();\n        // Optional&lt;Department&gt; optDepartment = departmentRepo.findByDepartmentName();\n        // if (optDepartment.isPresent()) {\n        //     throw new DuplicateDepartmentException();\n        // }\n        \n        \n        \n    }\n\n    public Department getDepartment(int departmentId) throws EntityNotFoundException{\n\n        Optional&lt;Department&gt; optDepartment = departmentRepo.findById(departmentId);\n        // return optDepartment.get();\n        \n        // if(optDepartment.isEmpty()){\n        //     throw new EntityNotFoundException();\n        // }\n\n        Department department = optDepartment.get();\n        // optDepartment.get();\n        return department;\n    }\n\n\n}\n"
    //                                     },
    //                                     {
    //                                         "type": "file",
    //                                         "name": "EmployeeService.java",
    //                                         "code": "package com.examly.springapp.service;\n\npublic interface EmployeeService {\n    \n}\n"
    //                                     },
    //                                     {
    //                                         "type": "file",
    //                                         "name": "EmployeeServiceImpl.java",
    //                                         "code": "package com.examly.springapp.service;\n\nimport org.springframework.stereotype.Service;\n\n@Service\npublic class EmployeeServiceImpl {\n    \n    \n\n}\n"
    //                                     }
    //                                 ]
    //                             },
    //                             {
    //                                 "type": "file",
    //                                 "name": "SpringappApplication.java",
    //                                 "code": "package com.examly.springapp;\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n\n@SpringBootApplication\npublic class SpringappApplication {\n\n\tpublic static void main(String[] args) {\n\t\tSpringApplication.run(SpringappApplication.class, args);\n\t}\n\n}\n"
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ],
    //         "aiAnalysis": "null",
    //         "Test_Submitted_Time": "2025-01-09 | 04:54:25 PM",
    //         "SonarAddedTime": "2025-01-09 | 04:45:09 PM",
    //         "Differnce_In_Submission": "The difference is more than 5 minutes or not recorded on submission of test. Check manually for Latest Code",
    //         "log": [
    //             "{\n  \"passed\": [],\n  \"failed\": [\n    {\n      \"testName\": \"testAddEmployee\",\n      \"errorMessage\": \"java.lang.AssertionError: Status expected:<201> but was:<404>\\r\\n\\tat com.examly.springapp.SpringappApplicationTests.testAddEmployee(SpringappApplicationTests\"\n    },\n    {\n      \"testName\": \"testGetDepartmentById\",\n      \"errorMessage\": \"java.lang.AssertionError: No value at JSON path \\\"$.employees[?(@.designation == 'Software Engineer')]\\\"\\r\\n\\tat com.examly.springapp.SpringappApplicationTests.testGetDepartmentById(SpringappApplicationTests\"\n    },\n    {\n      \"testName\": \"testgetAllEmployees\",\n      \"errorMessage\": \"java.lang.AssertionError: Status expected:<200> but was:<404>\\r\\n\\tat com.examly.springapp.SpringappApplicationTests.testgetAllEmployees(SpringappApplicationTests\"\n    },\n    {\n      \"testName\": \"testDuplicateException\",\n      \"errorMessage\": \"java.lang.AssertionError: Status expected:<500> but was:<201>\\r\\n\\tat com.examly.springapp.SpringappApplicationTests.testDuplicateException(SpringappApplicationTests\"\n    },\n    {\n      \"testName\": \"testDeleteEmployee\",\n      \"errorMessage\": \"java.lang.AssertionError: Status expected:<200> but was:<404>\\r\\n\\tat com.examly.springapp.SpringappApplicationTests.testDeleteEmployee(SpringappApplicationTests\"\n    },\n    {\n      \"testName\": \"testMethodHasQueryAnnotation\",\n      \"errorMessage\": \"org.opentest4j.AssertionFailedError: No method with @Query annotation found in EmployeeRepo interface.\\r\\n\\tat com.examly.springapp.SpringappApplicationTests.testMethodHasQueryAnnotation(SpringappApplicationTests\"\n    }\n  ]\n}"
    //         ],
    //         "TestCode": {}
    //     },
    //     {
    //         "key": "ddbcddbd322225714accddbdcfone",
    //         "test_Id": "https://admin.ltimindtree.iamneo.ai/result?testId=U2FsdGVkX19Z4PZoTYmHVHEN30zEJ7T7efsozhlg3rMrdhsIi7j2FdpWnMZIVjQjsv4TG3jFjQuRjqdfhr%2B26vnMCG5ITvQkC0Z7tzVQ9gXrqwca4iF534nb4MJIdoAPR2Ml71GrbAwGmNDj4cTuow%3D%3D",
    //         "name": "Gourish Menon",
    //         "tcList": [
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testAddUser",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testAddHealthProfile",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testCreateHealthProfileForNonExistentUser",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testCreateHealthProfileForUserWithExistingProfile",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testGetHealthProfileById",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testGetHealthProfileByIdNotFound",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testGetAllUsers",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testGetAllUsersNoContentWhenNoUsers",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testGetUserByEmail",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testDeleteHealthProfile",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testDeleteHealthProfileNotFound",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testQueryAnnotationPresent",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testOneToOneAnnotationPresentOnUser",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testOneToOneAnnotationPresentOnHealthProfile",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testModelFolder",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testUserModelFile",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testHealthProfileModelFile",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testControllerFolder",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testUserControllerFile",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testHealthProfileControllerFile",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testRepositoryFolder",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testUserRepositoryFile",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testHealthProfileRepositoryFile",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testServiceFolder",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testUserServiceFile",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testHealthProfileServiceFile",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testHealthProfileServiceImplExists",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testUserServiceImplExists",
    //                 "result": "Failure"
    //             }
    //         ],
    //         "QuestionData": "<p><strong style=\"background-color: rgb(255, 255, 255);\">Health Profile Management System</strong></p><p><strong>Overview:</strong></p><p>Create a Spring Boot application with two entities: User and HealthProfile. Each User can have one HealthProfile, and each HealthProfile is associated with one User. Implement a bidirectional one-to-one mapping from HealthProfile to User using Spring Data JPA.</p><p><br></p><p><strong>Functional Requirements:</strong></p><p>Create folders named controller, model, repository, exception, and service inside WORKSPACE/springapp/src/main/java/com/examly/springapp.</p><p>Inside the controller folder, create classes named UserController and HealthProfileController.</p><p>Inside the model folder, create a class named User with the following attributes:</p><ol><li>userId - Long (auto-generated primary key)</li><li>username - String</li><li>password - String</li><li>email - String</li><li>healthProfile - HealthProfile (OneToOne<span style=\"color: rgb(51, 51, 51);\">, mappedBy = \"user\", JsonManagedReference</span>)</li></ol><p>Create another class named HealthProfile with the following attributes:</p><ol><li>healthProfileId - Long (auto-generated primary key)</li><li>user - User (OneToOne, <span style=\"color: rgb(51, 51, 51);\">JsonBackReference </span>)</li><li>weight - double (in kilograms)</li><li>height - double (in meters)</li><li>fitnessGoals - String</li><li>activityLevel - String </li></ol><p>Implement getters, setters, and constructors (both parameterized and no-argument) for the User and HealthProfile entities.</p><p><br></p><p>Inside the exception folder, create exception for DuplicateHealthProfileException.</p><p>Inside the repository folder, create interfaces named UserRepo and HealthProfileRepo.</p><p>Inside the service folder, create interfaces named UserService and HealthProfileService.</p><p>Also, create classes UserServiceImpl and HealthProfileServiceImpl that implement UserService and HealthProfileService, respectively.</p><p><br></p><p>Refer to the below image for the project structure:</p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/7051831498-1\"></p><p><br></p><p><strong>API ENDPOINTS:</strong></p><p><br></p><p><strong>POST - /api/users</strong></p><ul><li><strong>Purpose</strong>: Creates a new User object.</li><li><strong>Success Response</strong>:</li><li class=\"ql-indent-1\">Status: <code>201 Created</code></li><li class=\"ql-indent-1\">Body: The created User object.</li><li><strong>Error Responses</strong>:</li><li class=\"ql-indent-1\"><strong>500 Internal Server Error</strong>: For any unexpected errors.</li></ul><p><strong>POST - /api/health-profiles/users/{userId}</strong></p><ul><li><strong>Purpose</strong>: Creates a new HealthProfile for the specified user.</li><li><strong>Success Response</strong>:</li><li class=\"ql-indent-1\">Status: <code>201 Created</code></li><li class=\"ql-indent-1\">Body: The created HealthProfile object.</li><li><strong>Error Responses</strong>:</li><li class=\"ql-indent-1\"><strong>204 No Content</strong>: If the user with the specified userId is not found, returns \"User not found for ID: [userId]\".</li><li class=\"ql-indent-1\"><strong>409 Conflict</strong>: If the user already has a health profile,<code>DuplicateHealthProfileException</code> is thrown, and the response message is \"User with name [username] already has a health profile\".</li><li class=\"ql-indent-1\"><strong>500 Internal Server Error</strong>: For any unexpected errors.</li></ul><p><strong>GET - /api/health-profiles/{healthProfileId}</strong></p><ul><li><strong>Purpose</strong>: Retrieves a HealthProfile by its <code>healthProfileId</code>.</li><li><strong>Success Response</strong>:</li><li class=\"ql-indent-1\">Status: <code>200 OK</code></li><li class=\"ql-indent-1\">Body: The HealthProfile object if found.</li><li><strong>Error Response</strong>:</li><li class=\"ql-indent-1\"><strong>204 No Content</strong>: If the health profile is not found, returns the message <code>\"Health profile not found\"</code>.</li></ul><p><strong>DELETE - /api/health-profiles/{healthProfileId}</strong></p><ul><li><strong>Purpose</strong>: Deletes a HealthProfile by its <code>healthProfileId</code>.</li><li><strong>Success Response</strong>:</li><li class=\"ql-indent-1\">Status: <code>200 OK</code></li><li class=\"ql-indent-1\">Body: <code>\"Health Profile with ID [healthProfileId] deleted successfully!\"</code>.</li><li><strong>Error Response</strong>:</li><li class=\"ql-indent-1\"><strong>204 No Content</strong>: If the health profile is not found, returns the message <code>\"Health profile not found\"</code>.</li></ul><p><strong>GET - /api/users</strong></p><ul><li><strong>Purpose</strong>: Retrieves all users.</li><li><strong>Success Response</strong>:</li><li class=\"ql-indent-1\">Status: <code>200 OK</code></li><li class=\"ql-indent-1\">Body: A list of <code>User</code> objects.</li><li><strong>Error Response</strong>:</li><li class=\"ql-indent-1\"><strong>204 No Content</strong>: If no users are found, returns the message <code>\"No users found\"</code>.</li><li class=\"ql-indent-1\"><strong>500 Internal Server Error</strong>: For any unexpected errors.</li></ul><p><strong>GET - /api/users/by-email</strong></p><p><strong>Purpose</strong>: Retrieves a list of <code>User</code> objects whose email addresses contain the specified substring provided via the <code>email</code> request parameter. The custom query is implemented in the repository layer using the <code>@Query</code> annotation to fetch results in descending order by email. ( eg API  /api/users/by-email?email=doe )</p><ul><li><strong>Success Response</strong>:</li><li class=\"ql-indent-1\">Status: <code>200 OK</code></li><li class=\"ql-indent-1\">Body: A list of <code>User</code> objects matching the email.</li><li><strong>Error Response</strong>:</li><li class=\"ql-indent-1\"><strong>404 Not Found</strong>: If no users match the given email address.</li></ul><p><br></p><p><strong>Platform Guidelines:</strong></p><p>To run the project use Terminal in the workspace.</p><p><br></p><p><strong>Spring Boot:</strong></p><p>Navigate to the springapp directory =&gt; cd springapp</p><p>To start/run the application 'mvn spring-boot:run'</p><p><br></p><p><strong>To Connect the Database Open the terminal</strong></p><p>mysql -u root --protocol=tcp -p</p><p>password:examly</p><p><br></p><p><strong>NOTE:</strong></p><p>Click on the Run Test Case button to pass all the test cases.</p>",
    //         "codeComponents": [
    //             {
    //                 "type": "directory",
    //                 "name": "springapp/src/main",
    //                 "contents": [
    //                     {
    //                         "type": "directory",
    //                         "name": "java/com/examly/springapp",
    //                         "contents": [
    //                             {
    //                                 "type": "directory",
    //                                 "name": "controller",
    //                                 "contents": [
    //                                     {
    //                                         "type": "file",
    //                                         "name": "HealthProfileController.java",
    //                                         "code": "package com.examly.springapp.controller;\n\nimport org.springframework.beans.factory.annotation.Autowired;\nimport org.springframework.http.ResponseEntity;\nimport org.springframework.web.bind.annotation.DeleteMapping;\nimport org.springframework.web.bind.annotation.GetMapping;\nimport org.springframework.web.bind.annotation.PathVariable;\nimport org.springframework.web.bind.annotation.PostMapping;\nimport org.springframework.web.bind.annotation.RequestBody;\nimport org.springframework.web.bind.annotation.RestController;\n\nimport com.examly.springapp.exception.DuplicateHealthProfileException;\nimport com.examly.springapp.model.HealthProfile;\nimport com.examly.springapp.service.HealthProfileServiceImpl;\n\n@RestController\npublic class HealthProfileController {\n    @Autowired\n    private HealthProfileServiceImpl healthProfileService;\n\n    @PostMapping(\"/api/health-profiles/users/{userId}\")\n    public ResponseEntity&lt;?&gt; createUser(@PathVariable long userId,@RequestBody HealthProfile health){\n        try{\n            HealthProfile heal = healthProfileService.addProfile(userId, health);\n            return ResponseEntity.status(201).body(heal);\n        }catch(IllegalArgumentException e){\n            return ResponseEntity.status(204).body(e.getMessage());\n        }catch(DuplicateHealthProfileException e){\n            return ResponseEntity.status(409).body(e.getMessage());\n        }\n    }\n    \n    @GetMapping(\"/api/health-profiles/{healthProfileId}\")\n    public ResponseEntity&lt;?&gt; getProfile(@PathVariable long healthProfileId){\n        try{\n            HealthProfile heal = healthProfileService.getProfile(healthProfileId);\n            return ResponseEntity.status(200).body(heal);\n        }catch(IllegalArgumentException e){\n            return ResponseEntity.status(204).body(e.getMessage());\n        }\n    }\n\n    @DeleteMapping(\"/api/health-profiles/{healthProfileId}\")\n    public ResponseEntity&lt;?&gt; deleteProfile(@PathVariable long healthProfileId){\n        try{\n            healthProfileService.deleteProfile(healthProfileId);\n            return ResponseEntity.status(200).body(\"Health Profile with ID \" + healthProfileId + \"deleted successfully!\");\n        }catch(IllegalArgumentException e){\n            return ResponseEntity.status(204).body(e.getMessage());\n        }\n    }\n}\n    "
    //                                     },
    //                                     {
    //                                         "type": "file",
    //                                         "name": "UserController.java",
    //                                         "code": "package com.examly.springapp.controller;\n\nimport java.util.List;\n\nimport org.springframework.beans.factory.annotation.Autowired;\nimport org.springframework.http.ResponseEntity;\nimport org.springframework.web.bind.annotation.GetMapping;\nimport org.springframework.web.bind.annotation.PathVariable;\nimport org.springframework.web.bind.annotation.PostMapping;\nimport org.springframework.web.bind.annotation.RequestBody;\nimport org.springframework.web.bind.annotation.RestController;\n\nimport com.examly.springapp.model.HealthProfile;\nimport com.examly.springapp.model.User;\nimport com.examly.springapp.service.UserServiceImpl;\n\n@RestController\npublic class UserController {\n    @Autowired\n    private UserServiceImpl userService;\n \n    @GetMapping(\"/api/users\")\n    public  ResponseEntity&lt;?&gt; getAll(){\n        return ResponseEntity.status(200).body(userService.getAll());\n    }\n \n    @PostMapping(\"/api/users\")\n    public ResponseEntity&lt;?&gt; createUser(@RequestBody User user){\n        return ResponseEntity.status(201).body(userService.addUser(user));\n    }\n \n   \n    \n}\n"
    //                                     }
    //                                 ]
    //                             },
    //                             {
    //                                 "type": "directory",
    //                                 "name": "exception",
    //                                 "contents": [
    //                                     {
    //                                         "type": "file",
    //                                         "name": "DuplicateHealthProfileException.java",
    //                                         "code": "package com.examly.springapp.exception;\n\npublic class DuplicateHealthProfileException extends RuntimeException{\n    public DuplicateHealthProfileException(String message){\n        super(message);\n    }\n}\n"
    //                                     }
    //                                 ]
    //                             },
    //                             {
    //                                 "type": "directory",
    //                                 "name": "model",
    //                                 "contents": [
    //                                     {
    //                                         "type": "file",
    //                                         "name": "HealthProfile.java",
    //                                         "code": "package com.examly.springapp.model;\n\nimport com.fasterxml.jackson.annotation.JsonBackReference;\n\nimport jakarta.persistence.CascadeType;\nimport jakarta.persistence.Entity;\nimport jakarta.persistence.GeneratedValue;\nimport jakarta.persistence.GenerationType;\nimport jakarta.persistence.Id;\nimport jakarta.persistence.OneToOne;\n\n@Entity\npublic class HealthProfile {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private long healthProfileId;\n    private double weight;\n    private double height;\n    private String fitnessGoals;\n    private String activityLevel;\n\n    \n    public Long getHealthProfileId() {\n        return healthProfileId;\n    }\n    public void setHealthProfileId(Long healthProfileId) {\n        this.healthProfileId = healthProfileId;\n    }\n    public double getWeight() {\n        return weight;\n    }\n    public void setWeight(double weight) {\n        this.weight = weight;\n    }\n    public double getHeight() {\n        return height;\n    }\n    public void setHeight(double height) {\n        this.height = height;\n    }\n    public String getFitnessGoals() {\n        return fitnessGoals;\n    }\n    public void setFitnessGoals(String fitnessGoals) {\n        this.fitnessGoals = fitnessGoals;\n    }\n    public String getActivityLevel() {\n        return activityLevel;\n    }\n    public void setActivityLevel(String activityLevel) {\n        this.activityLevel = activityLevel;\n    }\n    public User getUser() {\n        return user;\n    }\n    public void setUser(User user) {\n        this.user = user;\n    }\n\n    @OneToOne()\n    @JsonBackReference\n    private User user;\n\n    public HealthProfile() {\n    }\n\n    public HealthProfile(Long healthProfileId, double weight, double height, String fitnessGoals, String activityLevel,\n            User user) {\n        this.healthProfileId = healthProfileId;\n        this.weight = weight;\n        this.height = height;\n        this.fitnessGoals = fitnessGoals;\n        this.activityLevel = activityLevel;\n        this.user = user;\n    }\n    @Override\n    public String toString() {\n        return \"HealthProfile [healthProfileId=\" + healthProfileId + \", weight=\" + weight + \", height=\" + height\n                + \", fitnessGoals=\" + fitnessGoals + \", activityLevel=\" + activityLevel + \", user=\" + user + \"]\";\n    }\n\n    \n    \n\n    \n\n}\n"
    //                                     },
    //                                     {
    //                                         "type": "file",
    //                                         "name": "User.java",
    //                                         "code": "package com.examly.springapp.model;\n\nimport com.fasterxml.jackson.annotation.JsonManagedReference;\n\nimport jakarta.persistence.CascadeType;\nimport jakarta.persistence.Entity;\nimport jakarta.persistence.GeneratedValue;\nimport jakarta.persistence.GenerationType;\nimport jakarta.persistence.Id;\nimport jakarta.persistence.OneToOne;\n\n@Entity\npublic class User {\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private long userId;\n    private String username;\n    private String password;\n    private String email;\n    @OneToOne(mappedBy = \"user\",cascade = CascadeType.ALL)\n    @JsonManagedReference\n    private HealthProfile healthProfile;\n    public long getUserId() {\n        return userId;\n    }\n    public void setUserId(Long userId) {\n        this.userId = userId;\n    }\n    public String getUsername() {\n        return username;\n    }\n    public void setUsername(String username) {\n        this.username = username;\n    }\n    public String getPassword() {\n        return password;\n    }\n    public void setPassword(String password) {\n        this.password = password;\n    }\n    public String getEmail() {\n        return email;\n    }\n    public void setEmail(String email) {\n        this.email = email;\n    }\n    public HealthProfile getHealthProfile() {\n        return healthProfile;\n    }\n    public void setHealthProfile(HealthProfile healthProfile) {\n        this.healthProfile = healthProfile;\n    }\n    public User() {\n    }\n    public User(long userId, String username, String password, String email, HealthProfile healthProfile) {\n        this.userId = userId;\n        this.username = username;\n        this.password = password;\n        this.email = email;\n        this.healthProfile = healthProfile;\n    }\n    @Override\n    public String toString() {\n        return \"User [userId=\" + userId + \", username=\" + username + \", password=\" + password + \", email=\" + email\n                + \", healthProfile=\" + healthProfile + \"]\";\n    }\n    \n}\n"
    //                                     }
    //                                 ]
    //                             },
    //                             {
    //                                 "type": "directory",
    //                                 "name": "repository",
    //                                 "contents": [
    //                                     {
    //                                         "type": "file",
    //                                         "name": "HealthProfileRepo.java",
    //                                         "code": "package com.examly.springapp.repository;\n\nimport org.springframework.data.jpa.repository.JpaRepository;\nimport org.springframework.stereotype.Repository;\n\nimport com.examly.springapp.model.HealthProfile;\n\n@Repository\npublic interface HealthProfileRepo extends JpaRepository&lt;HealthProfile,Long&gt;{\n    \n}\n"
    //                                     },
    //                                     {
    //                                         "type": "file",
    //                                         "name": "UserRepo.java",
    //                                         "code": "package com.examly.springapp.repository;\n\nimport java.util.List;\n\nimport org.springframework.data.jpa.repository.JpaRepository;\nimport org.springframework.data.jpa.repository.Query;\nimport org.springframework.stereotype.Repository;\n\nimport com.examly.springapp.model.User;\n\n@Repository\npublic interface UserRepo extends JpaRepository&lt;User,Long&gt;{\n    @Query(\"SELECT u from User u where u.email LIKE %:email% ORDER BY u.email DESC\")\n    List&lt;User&gt; findByEmail(String email);\n}\n"
    //                                     }
    //                                 ]
    //                             },
    //                             {
    //                                 "type": "directory",
    //                                 "name": "service",
    //                                 "contents": [
    //                                     {
    //                                         "type": "file",
    //                                         "name": "HealthProfileService.java",
    //                                         "code": "package com.examly.springapp.service;\n\nimport com.examly.springapp.model.HealthProfile;\n\npublic interface HealthProfileService {\n    HealthProfile addProfile(long userId, HealthProfile health);\n    HealthProfile getProfile(long healthId);\n    void deleteProfile(long userId);\n} "
    //                                     },
    //                                     {
    //                                         "type": "file",
    //                                         "name": "HealthProfileServiceImpl.java",
    //                                         "code": "package com.examly.springapp.service;\n\nimport java.util.Optional;\n\nimport org.springframework.beans.factory.annotation.Autowired;\nimport org.springframework.stereotype.Service;\n\nimport com.examly.springapp.exception.DuplicateHealthProfileException;\nimport com.examly.springapp.model.HealthProfile;\nimport com.examly.springapp.model.User;\nimport com.examly.springapp.repository.HealthProfileRepo;\nimport com.examly.springapp.repository.UserRepo;\n\n@Service\npublic class HealthProfileServiceImpl implements HealthProfileService{\n    @Autowired\n    private HealthProfileRepo profileRepo;\n\n    @Autowired\n    private UserRepo userRepo;\n\n    @Override\n    public HealthProfile addProfile(long userId, HealthProfile health) {\n        Optional&lt;User&gt; us = userRepo.findById(userId);\n        if(us.isEmpty()){\n            throw new IllegalArgumentException(\"User not found for ID: \" + userId + \".\");\n        }\n        User user = userRepo.findById(userId).get();\n        if(user.getHealthProfile() == null){\n           // profileRepo.save(health);\n            user.setHealthProfile(health);\n            userRepo.save(user);\n            return health;\n        }else{\n            throw new DuplicateHealthProfileException(\"User with name \"+ us.get().getUsername() + \" already has a health profile\");\n        }\n    }\n    @Override\n    public HealthProfile getProfile(long healthId) {\n        Optional&lt;HealthProfile&gt; opt = profileRepo.findById(healthId);\n        // HealthProfile user = profileRepo.findById(userId).get();\n        return opt.get();\n    }\n\n    @Override\n    public void deleteProfile(long healthProfileId){\n        profileRepo.deleteById(healthProfileId);\n    }\n\n}\n"
    //                                     },
    //                                     {
    //                                         "type": "file",
    //                                         "name": "UserService.java",
    //                                         "code": "package com.examly.springapp.service;\n\nimport java.util.List;\n\nimport com.examly.springapp.model.User;\n\npublic interface UserService {\n    User addUser(User user);\n    List&lt;User&gt; getAll();\n    // List&lt;User&gt; findByEmail();\n\n}\n"
    //                                     },
    //                                     {
    //                                         "type": "file",
    //                                         "name": "UserServiceImpl.java",
    //                                         "code": "package com.examly.springapp.service;\n\nimport java.util.List;\n\nimport org.springframework.beans.factory.annotation.Autowired;\nimport org.springframework.stereotype.Service;\n\nimport com.examly.springapp.model.User;\nimport com.examly.springapp.repository.HealthProfileRepo;\nimport com.examly.springapp.repository.UserRepo;\n\n@Service\npublic class UserServiceImpl implements UserService{\n    @Autowired\n    private HealthProfileRepo healthRepo;\n\n    @Autowired\n    private UserRepo userRepo;\n    \n    @Override\n    public User addUser(User user) {\n        userRepo.save(user);\n        return user;\n    }\n\n    @Override\n    public List&lt;User&gt; getAll() {\n        return userRepo.findAll();\n    }\n\n    // @Override\n    // public List&lt;User&gt; findByEmail() {\n    //     userRepo.findByEmail(email);\n\n    // }\n    \n}\n"
    //                                     }
    //                                 ]
    //                             },
    //                             {
    //                                 "type": "file",
    //                                 "name": "SpringappApplication.java",
    //                                 "code": "package com.examly.springapp;\n\nimport org.springframework.boot.SpringApplication;\nimport org.springframework.boot.autoconfigure.SpringBootApplication;\n\n@SpringBootApplication\npublic class SpringappApplication {\n\n\tpublic static void main(String[] args) {\n\t\tSpringApplication.run(SpringappApplication.class, args);\n\t}\n\n}\n"
    //                             }
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ],
    //         "aiAnalysis": "null",
    //         "Test_Submitted_Time": "2025-01-09 | 05:25:10 PM",
    //         "SonarAddedTime": "2025-01-09 | 05:17:14 PM",
    //         "Differnce_In_Submission": "The difference is more than 5 minutes or not recorded on submission of test. Check manually for Latest Code",
    //         "log": [
    //             "{\n  \"passed\": [],\n  \"failed\": [\n    {\n      \"testName\": \"testGetAllUsersNoContentWhenNoUsers\",\n      \"errorMessage\": \"jakarta.servlet.ServletException: \\r\\nHandler dispatch failed: java.lang.Error: Unresolved compilation problem: \\r\\n\\tSyntax error, insert \\\";\\\" to complete BlockStatements\\r\\n\\r\\n\\tat com.examly.springapp.SpringappApplicationTests.testGetAllUsersNoContentWhenNoUsers(SpringappApplicationTests\"\n    },\n    {\n      \"testName\": \"testCreateHealthProfileForUserWithExistingProfile\",\n      \"errorMessage\": \"java.lang.AssertionError: Status expected:<409> but was:<201>\\r\\n\\tat com.examly.springapp.SpringappApplicationTests.testCreateHealthProfileForUserWithExistingProfile(SpringappApplicationTests\"\n    },\n    {\n      \"testName\": \"testGetHealthProfileByIdNotFound\",\n      \"errorMessage\": \"jakarta.servlet.ServletException: Request processing failed: java.util.NoSuchElementException: No value present\\r\\n\\tat com.examly.springapp.SpringappApplicationTests.testGetHealthProfileByIdNotFound(SpringappApplicationTests\"\n    },\n    {\n      \"testName\": \"testGetAllUsers\",\n      \"errorMessage\": \"jakarta.servlet.ServletException: \\r\\nHandler dispatch failed: java.lang.Error: Unresolved compilation problem: \\r\\n\\tSyntax error, insert \\\";\\\" to complete BlockStatements\\r\\n\\r\\n\\tat com.examly.springapp.SpringappApplicationTests.testGetAllUsers(SpringappApplicationTests\"\n    },\n    {\n      \"testName\": \"testGetUserByEmail\",\n      \"errorMessage\": \"java.lang.AssertionError: Status expected:<200> but was:<404>\\r\\n\\tat com.examly.springapp.SpringappApplicationTests.testGetUserByEmail(SpringappApplicationTests\"\n    },\n    {\n      \"testName\": \"testDeleteHealthProfile\",\n      \"errorMessage\": \"java.lang.AssertionError: Response content expected:<Health Profile with ID 1 deleted successfully!> but was:<Health Profile with ID 1deleted successfully!>\\r\\n\\tat com.examly.springapp.SpringappApplicationTests.testDeleteHealthProfile(SpringappApplicationTests\"\n    },\n    {\n      \"testName\": \"testDeleteHealthProfileNotFound\",\n      \"errorMessage\": \"java.lang.AssertionError: Status expected:<204> but was:<200>\\r\\n\\tat com.examly.springapp.SpringappApplicationTests.testDeleteHealthProfileNotFound(SpringappApplicationTests\"\n    }\n  ]\n}"
    //         ],
    //         "TestCode": {}
    //     },
    //     {
    //         "key": "efcdaadedbbde322306225ebaaaedeeeone",
    //         "test_Id": "https://admin.ltimindtree.iamneo.ai/result?testId=U2FsdGVkX19NmHvI1PFASDQ7R8NMuNEO18D7uMKGCul4jqbldr7TC2HDJfcGPN6vkUmewuQ80EB%2B6HIehkB%2BYr1E%2BLbfYBiv2QShh6L%2BUxkw3HMi0%2BZK9%2BdbIOFHEas4hsF19fwvKQ1KopOw9aOboQ%3D%3D",
    //         "name": "Ankit Kumar",
    //         "tcList": [
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testAddHouse",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testGetHouseById",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testGetAllHouses",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testDuplicateHouseException",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testAddAddress",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testGetAllAddressesByState",
    //                 "result": "Failure"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testDeleteAddress",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testOneToOneAnnotationPresent",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testControllerFolder",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testHouseControllerFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testAddressControllerFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testModelFolder",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testHouseFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testAddressFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testRepositoryFolder",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testHouseRepoFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testAddressRepoFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testServiceFolder",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testHouseServiceFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testAddressServiceFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testHouseServiceInterfaceExists",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testAddressInterfaceExists",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testHouseServiceImplFile",
    //                 "result": "Success"
    //             },
    //             {
    //                 "evaluation_type": "Maven Junit",
    //                 "name": "testAddressImplFile",
    //                 "result": "Success"
    //             }
    //         ],
    //         "QuestionData": "<p><strong>Overview:</strong></p><p>Create a Spring Boot application with two entities: \"<strong>House</strong>\" and \"<strong>Address</strong>\". Each <strong>House </strong>can have one <strong>Address</strong>, and each <strong>Address </strong>can be assigned to one <strong>House </strong>. Implement a bidirectional one-to-one mapping between these entities using Spring Data JPA.</p><p><br></p><p><strong>Functional Requirements:</strong></p><p>Create folders named controller, model, repository, and service inside the<strong> WORKSPACE/springapp/src/main/java/com/examly/springapp</strong>.</p><p>Inside the controller folder, create classes named <strong>\"HouseController” </strong>and <strong>AddressController\".</strong></p><p>Inside the model folder, Create a class named <strong>\"House\"</strong> with the following attributes:</p><ol><li>houseId - int (auto-generated primary key)</li><li>houseName - String</li><li>numberOfRooms - int</li><li>yearBuilt - int</li><li>address - Address (@OneToOne, mappedBy = \"house\", @JsonManagedReference)</li></ol><p>Create a class named <strong>\"Address\"</strong> with the following attributes:</p><ol><li>addressId - int (auto-generated primary key)</li><li>street - String</li><li>city - String</li><li>state - String</li><li>zipCode - String</li><li>house - House <span style=\"color: rgb(51, 51, 51);\">  (@OneToOne, @JoinColumn, @JsonBackReference)</span></li></ol><p>Implement getters, setters and constructors(both parameterized and no-argument) for the <strong>House </strong>and <strong>Address </strong>entities.</p><p>Inside the repository folder, create interfaces named <strong>“HouseRepo”</strong> and  <strong>\"AddressRepo\"</strong>.</p><p>Inside the service folder, create interfaces named <strong>\"HouseService\" </strong>and <strong>\"AddressService\"</strong>.</p><p>Also, create classes <strong>HouseServiceImpl </strong>and <strong>AddressServiceImpl </strong>which<strong> </strong>implement <strong>HouseService </strong>and <strong>AddressService, </strong>respectively.</p><p><br></p><p>Refer to the below image for the project structure:</p><p><br></p><p><img src=\"https://s3.amazonaws.com/exams-media-content/fe6502f0-dfe5-4ec3-b181-3e8e34b19894/questions/1156999612-1\"></p><p><br></p><p><strong>﻿API ENDPOINTS:</strong></p><p><strong>POST - \"/api/house\"</strong> - Returns response status 201 with house object on successful creation or else 500 ,In case of a DuplicateHouseException, specifically when the name already exists, it returns a status of 409(CONFLICT)  with an appropriate error message as<strong> \"</strong>House with name {houseName} already exists!<strong>\".</strong></p><p><strong>POST - \"/api/address/house/{houseId}\"</strong> - Returns response status 201 with a address object on successfully mapping the address to the houseId or else 500.</p><p><strong>GET - \"/api/house/{houseId}\"</strong> - Returns response status 200 with house object which includes details of address on successful retrieval or else 404.</p><p><strong>GET - \"/api/house\"</strong> - Returns response status 200 with List&lt;House&gt; object <span style=\"color: rgb(51, 51, 51);\"> which includes details of address </span>on successful retrieval or else 404.</p><p><strong>GET - \"/api/address/state/{state}\" </strong>- Returns a response status 200 with List&lt;Address&gt; object  based on successful retrieval or else 404.</p><p><strong>DELETE </strong>- \"<strong>/api/address/{addressId}</strong>\" - Returns response status 200 with String \"Address {addressId} deleted successfully\" on successful deletion or else \"Address not found with Id: \" + .addressId</p><p><br></p><p><strong>Platform Guidelines:</strong></p><p>To run the project use Terminal in the platform.</p><p><br></p><p><strong>Spring Boot:</strong></p><p>Navigate to the springapp directory =&gt; cd springapp</p><p>To start/run the application 'mvn spring-boot:run'</p><p><br></p><p><strong>To Connect the Database Open the terminal</strong></p><p>mysql -u root --protocol=tcp -p</p><p>password:examly</p><p><br></p><p><strong>NOTE:</strong></p><p>Click on the Run Test Case button to pass all the test cases</p>",
    //         "codeComponents": [],
    //         "aiAnalysis": "null",
    //         "Test_Submitted_Time": "2025-01-13 | 12:32:32 PM",
    //         "Differnce_In_Submission": "The difference is more than 5 minutes or not recorded on submission of test. Check manually for Latest Code",
    //         "log": [
    //             "{\n  \"passed\": [],\n  \"failed\": [\n    {\n      \"testName\": \"testGetAllAddressesByState\",\n      \"errorMessage\": \"java.lang.AssertionError: Status expected:<200> but was:<404>\\r\\n\\tat com.examly.springapp.SpringappApplicationTests.testGetAllAddressesByState(SpringappApplicationTests\"\n    }\n  ]\n}"
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
