     var fictionCategory = ["hardcover-fiction", "trade-fiction-paperback","combined-print-and-e-book-nonfiction", "mass-market-paperback", "e-book-fiction"];

     var nonfictionCategory = [ "combined-print-and-e-book-nonfiction", "paperback-nonfiction", "e-book-nonfiction" ];

     var youthCategory = [ "childrens-middle-grade", "young-adult"];
    
     var otherCategory = [ "mass-market-monthly", "hardcover-business-books", "graphic-books-and-manga", "paperback-advice", "hardcover-advice"];

//BOOK COLORS
    var colors = [ "rgb(157, 180, 192)", "rgb(206, 179, 184)", "rgb(255, 183, 159)", "rgb(201, 225, 227)", "rgb(240, 188, 104)", "rgb(235, 207, 196)", "rgb(247, 239, 226)", "rgb(234,223,219)", "rgb(192,196,182)", "rgb(173,174,176)", "rgb(235,207,196)", "rgb(216,194,181)", "rgb(201,225,227)", "rgb(238,238,238)", "rgb(228,218,193)", "rgb(242,207,179)", "rgb(230, 139, 119)", "rgb(232, 217, 214)", "rgb(192, 200, 189)", "rgb(227, 165, 89)", "rgb(222,184,135)" ];

    var offset = 0;
    var totalPageWidth = [];
    var className;
    var height;

//BOOK DATA
    var data = [];
    var bookData = [];
    var y = 440;

//GENRE CATEGORIES
    var category = [ "fiction", "nonfiction", "youth", "other" ];

//DEFINE DEFAULT URL 
    for ( var i = 0; i < fictionCategory.length; i++ ){
            var xmlhttp = new XMLHttpRequest();
             var url = "https://api.nytimes.com/svc/books/v3/lists/current/" + fictionCategory[i] + ".json?api-key=4O21EmI6mJFWvcviWdXel0kW4p1TWogR"; 
              xmlhttp.onreadystatechange = function() {
                  if ( this.readyState == 4 && this.status == 200 ) {
                        data = JSON.parse(this.responseText);
                        createBook(data);
                      }
                    };
              xmlhttp.open( "GET", url, true);
              xmlhttp.send();
                }

function changeBooks () {
    var sel = document.getElementById( "genre" );
    var opt = sel.options[sel.selectedIndex].value;

          if ( opt === category[0] ) {
            document.getElementById( "books" ).innerHTML = "";
            totalPageWidth = [];

               for ( var i = 0; i < fictionCategory.length; i++ ){
                  var xmlhttp = new XMLHttpRequest();
                  url = "https://api.nytimes.com/svc/books/v3/lists/current/" + fictionCategory[i] + ".json?api-key=4O21EmI6mJFWvcviWdXel0kW4p1TWogR"; 
                  
                  xmlhttp.onreadystatechange = function() {
                  if ( this.readyState == 4 && this.status == 200 ) {
                        data = JSON.parse( this.responseText );
                        createBook( data );
                      }
                    };
                    xmlhttp.open( "GET", url, true );
                    xmlhttp.send();
                    }
          shelfWidth();
          }

          if ( opt === category[1] ) {
            document.getElementById( "books" ).innerHTML = "";
            totalPageWidth = [];

            for ( var i = 0; i < nonfictionCategory.length; i++ ) {
                  var xmlhttp = new XMLHttpRequest();
                  url = "https://api.nytimes.com/svc/books/v3/lists/current/" + nonfictionCategory[i] + ".json?api-key=4O21EmI6mJFWvcviWdXel0kW4p1TWogR";

                  xmlhttp.onreadystatechange = function() {
                  if ( this.readyState == 4 && this.status == 200 ) {
                        data = JSON.parse( this.responseText );
                        createBook(data);
                      }
                    };
                    xmlhttp.open( "GET", url, true );
                    xmlhttp.send();
                    }
          shelfWidth();
          }

          if ( opt === category[2] ) {
            document.getElementById( "books" ).innerHTML = "";
            totalPageWidth = [];

                for ( var i = 0; i < youthCategory.length; i++ ) {
                  var xmlhttp = new XMLHttpRequest();
                    url = "https://api.nytimes.com/svc/books/v3/lists/current/" + youthCategory[i] + ".json?api-key=4O21EmI6mJFWvcviWdXel0kW4p1TWogR"; 
                 
                  xmlhttp.onreadystatechange = function() {
                  if ( this.readyState == 4 && this.status == 200 ) {
                        data = JSON.parse(this.responseText);
                        createBook( data );
                      }
                    };
                    xmlhttp.open( "GET", url, true );
                    xmlhttp.send();
                    }
          shelfWidth();
          }

          if ( opt === category[3] ) {
            document.getElementById( "books" ).innerHTML = "";
            totalPageWidth = [];
                for ( var i = 0; i < otherCategory.length; i++ ) {
                  var xmlhttp = new XMLHttpRequest();
                  url = "https://api.nytimes.com/svc/books/v3/lists/current/" + otherCategory[i] + ".json?api-key=4O21EmI6mJFWvcviWdXel0kW4p1TWogR"; 
                  xmlhttp.onreadystatechange = function() {
                  if ( this.readyState == 4 && this.status == 200 ) {
                        data = JSON.parse( this.responseText );
                        createBook(data);
                      }
                    };
                    xmlhttp.open( "GET", url, true);
                    xmlhttp.send();
                    }
            shelfWidth();
          }
    }

//CREATE BOOK
    function createBook( data ) {
       bookData = data.results.books;

//APPEND SVG TO THE BODY
       var svg = d3.select( "#books" )
       .data( bookData )
         .append( "svg" )
             .attr( "class", function(d) {
                var firstWord = d.author.replace(/ .*/,'');
                className = firstWord + d.weeks_on_list + d.rank_last_week;
                // console.log(className);
                return className;
             })

//CREATE GROUPS AND BIND DATA TO RECT
     var g = svg.selectAll( "g" )
       .data(bookData)
       .enter()
       .append( "g" )
       .attr( "class", "rect" )
       .on( "mouseover", hover)
       .on( "mouseout", hide)
       .append("a")
              .attr("target","_blank", function(d) { 
                    return d.amazon_product_url; 
                  })
              .attr("xlink:href", function(d) {
                    return d.amazon_product_url
                  })
         .each( function( d, i ) {
          var item = d3.select( this )
        
//CREATE BOOK SHAPE      
          item
          .append( "rect" )
          .attr( "width", function ( d, i ) {
              var pageCount;
              var isbn = d.primary_isbn13;
              var googleAPI = "https://www.googleapis.com/books/v1/volumes?q==isbn:" + isbn;
              $.ajax ({
                url: googleAPI,
                dataType: "json",
                async: false,
                success: function(response) {
                   try {
                            pageCount = response.items[0].volumeInfo.pageCount;
                        } catch (e) {
                            pageCount = 300;
                        }
                     }
                 })
              return pageCount / 3;
           })
        .attr( "y", function (d) {
        height = ( Math.random() * ( 270 - 360 ) + 360 );
        return y - height;
        })
        .attr( "height", function(d) {
        return height;
        })
        .attr( "stroke", "black" )
        .attr( "stroke-width", 5 )
        .attr( "fill", () => {
         let color = colors[ Math.floor( Math.random() * 21 ) ];
         return color;
       })
        .attr( 'rx', 50 )
        .attr( 'ry', 4 )
        .on( "mouseover", textShow)
        .on( "mouseout", textHide)

//FIND LAST BOOK POSITION
        item
        .attr('transform', function() {
          return 'translate(' + offset +  ', 0)';
        });

//UPDATE NEW BOOK POSITION
        var lastPosition = item.node().getBBox().width;
        offset += (lastPosition + 1) ;
          if ( i === 14 ) {
              var select = "." + className;
              var name = document.querySelector(select);
              name.style.width = offset;
              totalPageWidth.push(offset);
              offset = 0;
          }
      });

// BOOK TITLE TEXT
  g
      .append( "text" )
          .append( 'tspan' )
              .attr( "class", "title" )
              .attr( "height", 350 )
              .attr( "x", function(d) { 
                return y * -.965
              })
              .attr( "y", 18)
              .text( function(d) {
                return d.title 
              })
          .append( 'tspan' )
              .attr( "class", "author" )
              .attr( "x", function(d) { 
                return y * -.965
              })
              .attr( "y", 35)
              .text( function(d) {
                return d.author 
              })
    }

  shelfWidth();

  function shelfWidth () {
    setTimeout( function () {
// ADD PAGE WIDTH OF ALL BOOKS 
        var sum = 100 + totalPageWidth.reduce((x, y) => x + y);
        var screen = sum + "200";

//SET SUM OF ALL BOOK WIDTHS TO WIDTH OF THE SHELF
        document.getElementById( "books" ).style.width = sum + "px";
        document.getElementById( "shelf" ).style.width = screen + "px";
    }, 1000);
  }

  //SCROLL TO 500PX ON LOAD
    $( window ).scrollLeft(500); 

    function hover ( d, i ) {
      var animation = d3.select(this)
            animation.transition () 
            .duration(600)
            .attr( "transform", "translate(0, -80)" );
            }

    function hide ( d, i ) {
        var animation = d3.select(this)
            animation.transition () 
            .duration(600)
            .attr( "transform", "translate(0, 0)" );
            }

//TEXT ANIMATION
      function textShow ( d, i ) {
              var text = d3.select( this )._groups[0][0].nextElementSibling;
              text.style.setProperty( "visibility", "visible" );
            }

       function textHide ( d, i ) {
              var text = d3.select( this )._groups[0][0].nextElementSibling;
              text.style.setProperty( "visibility", "hidden" );
            }


