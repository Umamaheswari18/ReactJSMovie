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
                      					<li className="active"><a >Home</a></li>
                      					<li><a>Add Movie</a></li>
                      					<li><a>Update Movie</a></li>
                                <li><a>Contact Us</a></li>

                      			</ul>

                      </div>

		          </div>

					</div>
        );
      }
});


var MovieList = React.createClass({
     render: function () {
    var movierows = [];

   this.props.movies.forEach(function(movie) {

     movierows.push(<MovieItem movie={movie} key={movie.imdbID}  />);
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
  componentDidMount:function()
  {
    $('#deleteButton').on('click',function()
  {
    $.ajax({
      type:'DELETE',
      url:'/api/movies/' + $('#objectID').val(),
      success:function(result)
      {

      }

    });
  });
},

  render: function() {
    return(
        <div className="row" id="movieThing">
          <div className="col-sm-4">
            <img src={this.props.movie.Poster} alt="image" className="responsive" />
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

              <button className="btn btn-primary" id="deleteButton">Delete</button>
            </div>

        </div>

    );
  }
});

var MainBox=React.createClass({
    loadMovie:function(){
    $.ajax({
      type:'GET',
      url: '/api/movies',
      datatype:'json',
      success: function(data) {
          //console.log(data);
          this.setState({
            MoviesInput:data
          });

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
        <NavigationBar />
       <SearchBox  filterText={this.state.filterText} onUserInput={this.handleUserInput} />
       <MovieList filterText={this.state.filterText} movies={this.state.MoviesInput}  />
      </div>
    );
  }
});

ReactDOM.render(
  <MainBox />,
  document.getElementById('content')
);
