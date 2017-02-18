/**
* @Author: Prakash
* @Date:   2017-02-18T15:09:56+05:30
* @Last modified by:   Prakash
* @Last modified time: 2017-02-18T15:09:56+05:30
*/


import React,{Component} from "react";
// http call
import axios from 'axios';
import _ from 'lodash';

// d3
const Chart = require('chart.js')

let style = {
  overflow: {
    overflow:"hidden",
  }
};
class Movies extends Component {
  constructor(props) {
      super(props);
      this.state = {
          loadingMovies: true,
          movies: "",
          showableMovies: [],
          showLimit: 10,
          sortedType: "none",
          searchValue:"",
          searchList:this.getSearchList(),
          d3Visual: false,
      };
      // get movies from api
      this.getMovies();
  }
  getMovies() {
      axios.get('http://starlord.hackerearth.com/simility/movieslisting').then((data) => {
          this.setState({
              loadingMovies: false,
              movies: data.data,
          });
          this.showMovie();
      });
  }

  showMovie(n = 10) {
      this.setState({
          showableMovies: _.take(this.state.movies, n),
      });
  }
  listMovies() {
      let movies = this.state.showableMovies.map((mov, index) =>
      <div className="col-md-4 panel-height" key={index}>
        <a href={mov.movie_imdb_link} target="_blank">
          <div className="panel panel-warning">
              <div className="panel-heading">
                  {mov.movie_title}
              </div>
              <div className="panel-body">
                  <div className="row">
                      <div className="col-md-6">
                          <span className="glyphicon glyphicon-camera"></span> Director
                      </div>
                      <div className="col-md-6">
                          {mov.director_name}
                      </div>
                  </div>
                  <hr/>
                  <div className="row">
                      <div className="col-md-6">
                          <span className="glyphicon glyphicon-user"></span> Actors
                      </div>
                      <div className="col-md-6">
                          {mov.actor_1_name} , {mov.actor_2_name}
                      </div>
                  </div>
                  <hr/>
                  <div className="row">
                      <div className="col-md-6">
                          <span className="glyphicon glyphicon-globe"></span> Country - Language
                      </div>
                      <div className="col-md-6">
                          {mov.country} - {mov.language}
                      </div>
                  </div>
                  <hr/>
                  <div className="row">
                      <div className="col-md-6">
                          <span className="glyphicon glyphicon-time"></span> Year - {mov.title_year}
                      </div>
                      <div className="col-md-6">
                      <span className="glyphicon glyphicon-usd"></span>
                          {mov.budget}
                      </div>
                  </div>
                  <hr/>
                  <div className="row">
                      <div className="col-md-12">
                          <span className="glyphicon glyphicon-star"></span> Rating - {mov.content_rating}
                      </div>
                  </div>
                  <hr/>
                  <div className="row" style={style.overflow}>
                  <div className="col-md-12" >
                   {mov.genres}
                  </div>
                  </div>
              </div>
          </div>
          </a>
      </div>

      );
      return movies;
  }
  loadMoreMovies = () => {
    let newCount = this.state.showLimit + 10;
      this.setState({
          showLimit: newCount
      });
      this.showMovie(newCount);
  }
  searchMovies = (e) => {
    let value = e.currentTarget.value;
    this.setState({
      searchValue: value
    });

    if(value.length !== 0) {
      let searchResults = _.filter(this.state.movies,(val) => {
        if(val.movie_title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
          return val;
        }
      });
      this.setState({
        showableMovies: searchResults
      });
    }
    else {
      this.showMovie();
    }

  }
  saveRecentSearch = (e) => {
    let value = e.currentTarget.value;
      if(localStorage.recentSearch === undefined) {
        let values = [];
        values.push(value);
        localStorage.recentSearch = JSON.stringify(values);
      } else {
        let values = JSON.parse(localStorage.recentSearch);
        if(values.length === 5) {
          values.pop();
        }
        values.push(value);
        this.setState({
          searchList: _.reverse(values),
        });
        localStorage.recentSearch = JSON.stringify(values);
      }
  }
  getSearchList() {
    if(localStorage.recentSearch !== undefined) {
      let values = JSON.parse(localStorage.recentSearch);
      return _.reverse(values);
    } else {
      return [];
    }
  }
  createSearchList() {
    return this.state.searchList.map((search,index) =>
      <option key={index} value={search} />
    );
  }
  sortBy = (e) => {
    let type =  e.currentTarget.dataset.sort;
    let sorted;
    let _this = this;
    _this.setState({
      sortedType: e.currentTarget.innerHTML,
    });
    switch (type) {
      case "name":
        sorted = _.sortBy(_this.state.showableMovies, ['movie_title']);
        this.setState({
          showableMovies: sorted,
        });
        break;
      case "year":
        sorted = _.sortBy(_this.state.showableMovies, ['title_year']);
        this.setState({
          showableMovies: sorted,
        });
        break;
      case "budget":
        sorted = _.sortBy(_this.state.showableMovies, ['budget']);
        this.setState({
          showableMovies: sorted,
        });
        break;
        default:
        break;
    }
  }
  toggleD3 = () => {
    let d3v = !this.state.d3Visual;
      this.setState({
        d3Visual: d3v,
      });
      if(d3v) {
        this.renderD3();
      }
  }
  renderD3() {
    var ctx = document.getElementById("myChart");
    let labels = [];
    let charData = [];
    let colors = {
      background: [],
      border: []
    };
    let sampleBackgroudColor = [  'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)'];
      let sampleBorderColor = [
        'rgba(255,99,132,1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ];
    this.state.showableMovies.map((mov) => {
      labels.push(mov.movie_title);
      charData.push(mov.budget);
      let count = Math.floor(Math.random()*5);
      colors.background.push(sampleBackgroudColor[count]);
      colors.border.push(sampleBorderColor[count]);
      return "";
    });
let myChart = new Chart(ctx, {
  type: 'bar',
  data: {
      labels: labels,
      datasets: [{
          label: 'Movies vs Buget',
          data: charData,
          backgroundColor: colors.background,
          borderColor: colors.border,
          borderWidth: 1
      }]
  }
});
    }
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-offset-2 col-md-6">
            <input type="text" className="form-control" id="searchField" list="searchList" placeholder="Search Movies by name" onKeyUp={this.searchMovies} onBlur={this.saveRecentSearch}/>
            <datalist id="searchList">
            {this.createSearchList()}
          </datalist>
          </div>

          <div className="col-md-2">
              <div className="btn-group">
                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  Sort By : {this.state.sortedType} <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                  <li><a href="#" onClick={this.sortBy} data-sort="name">Name</a></li>
                  <li><a href="#" onClick={this.sortBy} data-sort="year">Year</a></li>
                  <li><a href="#" onClick={this.sortBy} data-sort="budget">Budget</a></li>
                </ul>
              </div>
          </div>
          <div className="col-md-2">
            <button className="btn btn-default" onClick={this.toggleD3}>{this.state.d3Visual ? 'back':'D3 Visual'}</button>
          </div>
        </div>
        <div className="row">
          <span className="pull-left">
            {this.state.searchValue.length !==0 ? "Search Results of : `"+this.state.searchValue+"`":""}
          </span>
        </div>
        <div className={this.state.d3Visual ? 'hide': 'row'}>
        <div className={this.state.loadingMovies ? 'container': 'hide'}>
          <h3>Loading...</h3>
        </div>
          <div className={this.state.loadingMovies ? 'hide': 'container'}>
            <hr/>
            {this.listMovies()}
          </div>
          <hr/>
          <div className={this.state.loadingMovies ? 'hide': 'row'}>
            <button className={this.state.movies.length === this.state.showableMovies.length ? 'hide': 'btn btn-default'} onClick={this.loadMoreMovies}> Load more </button>
          </div>
        </div>
        <div className={this.state.d3Visual ? 'row': 'hide'}>
          <h3>Visual Chart</h3>
          <div className="chart">
            <canvas id="myChart" width="100" height="100"></canvas>
          </div>
        </div>

      </div>
    )
  }
}

export default Movies;
