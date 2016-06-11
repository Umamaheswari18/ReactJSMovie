var { Router, Route, IndexRoute, Link, browserHistory } = ReactRouter

var MainLayout=React.createClass({
  render:function()
  {
    return(
    <div className="container" id="main">
      <NavigationBar />
      <main>
        {this.props.children}
      </main>
    </div>
  );
  }
});

var Home=React.createClass({
  render:function()
  {
    return(
      <div className="row" id="homeBox">
    		<div className="col-md-12">
    			<div className="jumbotron">
    				<h2>
    					Welcome!
    				</h2>
    				<p>
    					Movies should watch before you die...
    				</p>
            <p>
              Check out the list
              <Link to="/movies" className="btn btn-primary">Click Here</Link>
            </p>
    			</div>
    		</div>
    	</div>
      );
  }
});



var SearchBox = React.createClass({

  handleChange: function() {
  this.props.onUserInput(
    this.refs.filterTextInput.value
  );
},


componentDidMount: function() {
  $('#searchSave').on('click',function()
  {
  $.ajax({
    type:'POST',
    url: '/api/movies' ,
    data: jQuery.param({ Title: $('#searchBox').val() }),
    dataType: 'json',
    cache: false,
    success: function(data) {
          $('#searchBox').val(" ");
    }
  });

});

 },

  render : function() {
    return (
      <div className="row" id="searchThing">
        <form role="form">
				    <div className="form-group">
					       <center><h2>Search Movie</h2></center>
					      <input type="text" className="form-control" id="searchBox" name="Title"  value={this.props.filterText}
                 ref="filterTextInput"
                 onChange={this.handleChange} placeholder="Search Your Favourite movie..." />
            </div>
        </form>
        <center><button className="btn btn-primary" id="searchSave">Search and Save</button></center>
        <br />
      </div>
    );
  }
});

var NavigationBar=React.createClass({
  render:function()
  {
    return(

  <div className="navbar navbar-fixed-top">

              <div className="container">


          			    <div className="navbar-collapse collapse navbar-responsive-collapse">

                          <ul className="nav navbar-nav">
                      					<li className="active"><Link to="/home" >Home</Link></li>
                      					<li><Link to="/movies">Movies</Link></li>
                      					<li><Link to="/addmovie">Add Movie</Link></li>
                                <li><Link to="/update">Update Movie</Link></li>

                      			</ul>
                      </div>
		          </div>
					</div>
        );
      }
});


var MovieList = React.createClass({

  handleDelete: function(Movieid){
      return this.props.onMovieDelete(Movieid);
    },
     render: function () {
    var movierows = [];

   this.props.movies.forEach(function(movie) {

     movierows.push(<MovieItem movie={movie} key={movie.imdbID} Movieid={movie._id} onDelete = {this.handleDelete}  />);
   /*if(movie.Title.indexOf(this.props.filterText) === -1)
       {
         return;
       } */

   }.bind(this));


       return (
      <div>
        {movierows}
      </div>
        );
   }
});

var MovieItem = React.createClass({

  handleClick: function(){
      var Movieid = this.props.Movieid;
      return this.props.onDelete(Movieid);
    },


  render: function() {
    return(
        <div className="row" id="movieThing">
          <div className="col-sm-4">
            <img src={this.props.movie.Poster} alt="image" className="img-responsive" id="imagePoster"/>
          </div>

            <div className="col-sm-8">
              <h3 id="movieTitle">Title: {this.props.movie.Title}</h3>
              <p>Actors: {this.props.movie.Actors}</p>
              <p>Director: {this.props.movie.Director}</p>
              <p>Plot: {this.props.movie.Plot} </p>
              <p>Released: {this.props.movie.Released}</p>
              <p> Imdb ID: {this.props.movie.imdbID}</p>
              <input type="text"  value={this.props.movie._id} id="objectID" hidden readOnly /><br /> <br /> <br />
              <a href={'http://www.imdb.com/title/'+this.props.movie.imdbID} className="btn btn-primary" target="_blank">View on Imdb </a>
              &nbsp; &nbsp; &nbsp;
              <button className="btn btn-danger" onClick={this.handleClick} id="deleteButton">Delete</button><br /> <br />

            </div>

        </div>

    );
  }
});

var MovieBox=React.createClass({
    loadMovie:function(){
    $.ajax({
      type:'GET',
      url: '/api/movies',
      datatype:'json',
      success: function(data) {
          this.setState({
            MoviesInput:data
          });

        }.bind(this)
    });
  },

  handleMovieDelete: function(Movieid){
    $.ajax({
        type: 'DELETE',
      url: '/api/movies/' +Movieid,
      //data: {"id" : Movieid},

      dataType: 'json',
      success: function (data) {
        this.loadMovie();
      }.bind(this)

      });
  },
  componentDidMount: function() {
        this.loadMovie();
       setInterval(this.loadMovie,1000);
  },
  getInitialState: function() {
   return {
     filterText: '',
      MoviesInput: []
     };
  },

  handleUserInput: function(filterText) {
    this.setState({
      filterText: filterText
     });
  },
  render: function()
  {

    return(

    <div className="container">

       <SearchBox  filterText={this.state.filterText} onUserInput={this.handleUserInput} />
       <MovieList filterText={this.state.filterText} movies={this.state.MoviesInput} onMovieDelete={this.handleMovieDelete}  />
      </div>
    );
  }
});


var AddMovieBox=React.createClass({
  componentDidMount:function()
  {

      $('#addMovieButton').on('click',function()
      {
        $.ajax({
        type:'POST',
        url:'/api/movies/add',
        data: jQuery.param({ Title: $('#addTitle').val(),Year: $('#addYear').val(),Director:$('#addDirector').val(),
      Actors:$('#addActors').val(),Plot:$('#addPlot').val(),Released:$('#addReleased').val(),Poster:$('#addPoster').val(),
      someid:$('#addID').val() }),
        dataType: 'json',
        cache: false,
        success:function(result)
        {

        }
      })

    })
  },

  render:function()
  {
    return(
      <div className="row" id="addMovie">
		    <div className="col-md-12">
			     <form role="form">
				       <div className="form-group">

					          <label for="addTitle">
						              Title
					          </label>

                    <input type="text" className="form-control" id="addTitle" />
				        </div>

                <div className="form-group">

					           <label for="addYear">
						               Year
					           </label>
					           <input type="text" className="form-control" id="addYear" />
				        </div>
                <div className="form-group">

					           <label for="addActors">
						               Actors
					           </label>
					           <input type="text" className="form-control" id="addActors" />
				        </div>
                <div className="form-group">

					           <label for="addDirector">
						               Director
					           </label>
					           <input type="text" className="form-control" id="addDirector" />
				        </div>
                <div className="form-group">

                     <label for="addPlot">
                          Plot
                     </label>
                     <input type="text" className="form-control" id="addPlot" />
                </div>
                <div className="form-group">

                     <label for="addReleased">
                          Released
                     </label>
                     <input type="text" className="form-control" id="addReleased" />
                </div>
                <div className="form-group">
                  <label for="addID">
          						Give some Id
          				</label>
  					      <input type="text" id="addID"  className="form-control" />
                </div>

              <div className="form-group">
                <label for="addPoster">
        						image Address
        				</label>
					      <input type="text" id="addPoster"  className="form-control" />
              </div>

			    </form>
          <center>
          <button className="btn btn-default btn-primary" id="addMovieButton" className="form-control">
                 Add Movie
          </button>
          </center>
		    </div>
	     </div>
    );
  }
});

var UpdateMovieBox=React.createClass({

  componentDidMount:function(){
  $.ajax({
    type:'GET',
    url: '/api/movies',
    datatype:'json',
    success: function(data) {
        this.setState({
          MoviesInput:data
        });

      }.bind(this)
  });
},
handleMovieUpdate: function(Movieid,MovieTitle,MovieActors,MovieDirector,MoviePlot,MovieReleased){
  $.ajax({
      type: 'PUT',
      url: '/api/movies/' + Movieid,
      data: { Title:MovieTitle,Actors:MovieActors,Director:MovieDirector,Plot:MoviePlot,Released:MovieReleased },
    dataType: 'json',
    success: function (data) {
      //this.setState({MoviesInput: data});
    }.bind(this),

    });
},

getInitialState: function() {
 return {

    MoviesInput: []
   };
},


render: function()
{

  return(

  <div>

         <UpdateMovieList  movies={this.state.MoviesInput} onMovieUpdate={this.handleMovieUpdate}  />
    </div>
  );
}

})

var UpdateMovieList = React.createClass({
  handleUpdate: function(Movieid,MovieTitle,MovieActors,MovieDirector,MoviePlot,MovieReleased){
      return this.props.onMovieUpdate(Movieid,MovieTitle,MovieActors,MovieDirector,MoviePlot,MovieReleased);
    },
    getInitialState:function()
    {
      return{
      movieTitleInput:''
    };
    },

    handleUserInput: function(filterText) {
      this.setState({
      movieTitleInput  : movieTitleInput
       });
    },

     render: function () {
    var movierows = [];

   this.props.movies.forEach(function(movie) {

     movierows.push(<UpdateMovieItem movie={movie} key={movie.imdbID} Movieid={movie._id}
       MovieTitle={movie.Title} MovieActors={movie.Actors} MovieDirector={movie.Director} MoviePlot={movie.Plot}
       MovieReleased={movie.Released}
        onUpdate={this.handleUpdate} onUserInput={this.handleUserInput} movieTitleInput={this.state.movieTitleInput} />);
   /*if(movie.Title.indexOf(this.props.filterText) === -1)
       {
         return;
       } */

   }.bind(this));


       return (
      <div>
        {movierows}
      </div>
        );
   }
});

var UpdateMovieItem = React.createClass({

  getInitialState:function()
  {
    return{
    Title:this.props.movie.Title,
    Actors:this.props.movie.Actors,
    Director:this.props.movie.Director,
    Plot:this.props.movie.Plot,
    Released:this.props.movie.Released
  };
},

  handleActorsChange:function(e)
  {
    this.setState({ Actors : e.target.value })
  },

  handleDirectorChange:function(e)
  {
    this.setState({ Director : e.target.value })
  },

  handlePlotChange:function(e)
  {
    this.setState({ Plot : e.target.value })
  },
  handleReleasedChange:function(e)
  {
    this.setState({ Released : e.target.value })
  },
  handleUpdate: function(){
      var Movieid = this.props.Movieid;
      var MovieTitle=this.state.Title;
      var MovieActors=this.state.Actors;
      var MovieDirector=this.state.Director;
      var MoviePlot=this.state.Plot;
      var MovieReleased=this.state.Released;
      return this.props.onUpdate(Movieid,MovieTitle,MovieActors,MovieDirector,MoviePlot,MovieReleased);
    },

  render: function() {
    return(
        <div className="row" id="movieThing">
          <div className="col-sm-4">
            <img src={this.props.movie.Poster} alt="image" className="responsive" />
          </div>

            <div className="col-sm-8">
            <form role="form">
              <div className="form-group">
                  <label>
                    Title:
                  </label>
                  <input type="text"  className="form-control" value={this.state.Title} id="movieTitle"
                  readOnly />
              </div>
              <div className="form-group">
                  <label>
                    Actors:
                  </label>
                  <input type="text"   className="form-control" value={this.state.Actors} id="movieActors"
                  onChange={this.handleActorsChange} />
              </div>
              <div className="form-group">
                  <label>
                    Director:
                  </label>
                  <input type="text"   className="form-control" value={this.state.Director} id="movieDirector"
                  onChange={this.handleDirectorChange}  />
              </div>
              <div className="form-group">
                  <label>
                    Plot:
                  </label>
                  <input type="text"   className="form-control" value={this.state.Plot} id="moviePlot"
                  onChange={this.handlePlotChange}  />
              </div>
              <div className="form-group">
                  <label>
                    Released:
                  </label>
                  <input type="text"   className="form-control" value={this.state.Released} id="movieReleased"
                  onChange={this.handleReleasedChange}  />
              </div>
              <div className="form-group">
                  <label>
                      Movie ID:
                  </label>
                  <input type="text"   className="form-control" value={this.props.movie._id} id="objectID" readOnly />
              </div><br /> <br /> <br />
              </form>

              <button className="btn btn-warning" onClick={this.handleUpdate} id="updateButton">Save Changes</button>

            </div>

        </div>

    );
  }
});





var browserHistory=ReactRouter.browserHistory;
ReactDOM.render(
  (
    <Router history={browserHistory}>
      <Route path="/" component={MainLayout}>
      <IndexRoute component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/movies" component={MovieBox} />
        <Route path="/addmovie" component={AddMovieBox} />
        <Route path="/update" component={UpdateMovieBox} />
      </Route>
    </Router>
),document.getElementById('content'))
