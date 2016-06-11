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
      data: {"id" : Movieid},

      dataType: 'json',
      success: function (data) {
        this.setState({MoviesInput: data});
      }.bind(this),

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


var browserHistory=ReactRouter.browserHistory;
ReactDOM.render(
  (
    <Router history={browserHistory}>
      <Route path="/" component={MainLayout}>
      <IndexRoute component={Home} />
        <Route path="/home" component={Home} />
        <Route path="/movies" component={MovieBox} />
        <Route path="/addmovie" component={AddMovieBox} />

      </Route>
    </Router>
),document.getElementById('content'))
