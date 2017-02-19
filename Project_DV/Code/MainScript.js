/*
 * 
 * 
 * 
	Tanmay Thakar	
	#01608538
 */

window.onload = function() {
	var q = d3_queue.queue();
	var chicago_data,orignal_data;
	var data_location;
	
					/*
					 * q
					.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$limit=50000&$$app_token=a1po5xKrMxtMXRWdPxK5xZI4S&$offset=1")
					.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$limit=50000&$$app_token=a1po5xKrMxtMXRWdPxK5xZI4S&$offset=2" )
					.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$limit=50000&$$app_token=a1po5xKrMxtMXRWdPxK5xZI4S&$offset=3" )
					.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$limit=50000&$$app_token=a1po5xKrMxtMXRWdPxK5xZI4S&$offset=4" )
					.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$limit=50000&$$app_token=a1po5xKrMxtMXRWdPxK5xZI4S&$offset=5" )
					.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$limit=50000&$$app_token=a1po5xKrMxtMXRWdPxK5xZI4S&$offset=6" )
					.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$limit=50000&$$app_token=a1po5xKrMxtMXRWdPxK5xZI4S&$offset=7" )
					.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$limit=50000&$$app_token=a1po5xKrMxtMXRWdPxK5xZI4S&$offset=8" )
					.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$limit=50000&$$app_token=a1po5xKrMxtMXRWdPxK5xZI4S&$offset=9" )
					.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$limit=50000&$$app_token=a1po5xKrMxtMXRWdPxK5xZI4S&$offset=10" )
			 */
		q
		.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$select=primary_type,%20date,%20arrest,%20latitude,%20longitude&$limit=50000&$offset=1")
		.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$select=primary_type,%20date,%20arrest,%20latitude,%20longitude&$limit=50000&$offset=2" )
		.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$select=primary_type,%20date,%20arrest,%20latitude,%20longitude&$limit=50000&$offset=3" )
		.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$select=primary_type,%20date,%20arrest,%20latitude,%20longitude&$limit=50000&$offset=4" )
		.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$select=primary_type,%20date,%20arrest,%20latitude,%20longitude&$limit=50000&$offset=5" )
		.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$select=primary_type,%20date,%20arrest,%20latitude,%20longitude&$limit=50000&$offset=6" )
		.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$select=primary_type,%20date,%20arrest,%20latitude,%20longitude&$limit=50000&$offset=7" )
		.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$select=primary_type,%20date,%20arrest,%20latitude,%20longitude&$limit=50000&$offset=8" )
		.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$select=primary_type,%20date,%20arrest,%20latitude,%20longitude&$limit=50000&$offset=9" )
		.defer(d3.json,"https://data.cityofchicago.org/resource/6zsd-86xi.json?$select=primary_type,%20date,%20arrest,%20latitude,%20longitude&$limit=50000&$offset=10" )
		.awaitAll(drawprojection);	
	// Main Api 
	// "https://data.cityofchicago.org/resource/6zsd-86xi.json"

}
function drawprojection(error, data) {
	if (error)
		throw error;

	var width = 1000;
	var height = 600;

	var projection = d3.geo.mercator()
	.scale((1 << 25) / 2 / Math.PI)
	.translate([-width / 2, -height / 2]); 
	orignal_data = d3.merge(data);
	console.log("SIZEEEEEEEE",orignal_data.length);
	chicago_data = orignal_data.slice();
	drawmapbutton("#cmap", projection, width, height);

}
/*This Method Draw Map and point on it for top 100
 * 
Refrence  http://bl.ocks.org/jhubley/c22e71c05e3c3bfadcae
*/
function drawmapbutton(divId, projection, w, h) {
	var parseDate = d3.time.format("%Y");
	chicago_data_three = chicago_data.slice(0);

	var crimecountByYear = d3.nest().key(function(d) {
		return d.longitude
	}).key(function(d) {
		return d.latitude
	}).rollup(function(v) {
		return v.length;
	}).entries(chicago_data_three);

	crimecountByYear.forEach(function(d) {

		d.values.sort(function(a, b) {
			var keyA = a.values, keyB = b.values;
			// Compare the 2 dates
			if (keyA < keyB)
				return -1;
			if (keyA > keyB)
				return 1;
			return 0;
		});

	});
	console.log(crimecountByYear.length);
	crimecountByYear = crimecountByYear.splice(0,100);
	
	var width = Math.max(960, window.innerWidth),
    height = Math.max(500, window.innerHeight),
    prefix = prefixMatch(["webkit", "ms", "Moz", "O"]);	
	
	var tile = d3.geo.tile()
    .size([width, height]);

	
	
	var zoom = d3.behavior.zoom()
    .scale(projection.scale() * 2 * Math.PI)
    .scaleExtent([1 << 9, 1 << 25])

.translate(projection([-87.623177,41.881832]).map(function(x) { return -x; }))
    .on("zoom", zoomed);
	
	var container = d3.select(divId)
    .attr("id", "container")
    .style("width", width + "px")
    .style("height", height + "px")
    .call(zoom);
	
	var map = container.append("g")
		.attr("id", "map")

	var points = container.append("svg")
		.attr("id", "points")
			
	var layer = map.append("div")
		.attr("class", "layer");
	
	zoomed();
	
	// get point and add to map
	function createMap(dataset) {
		//#14e6b7
		d3.select("#points").selectAll("circle").data(dataset) //plotted 	locations on map
		.enter()
		.append("circle")
		.style("fill", "#C40000")
		.style("opacity", 0.7)
		.attr("r", 8)
		.attr("cx", function(d) {return projection([d.key,d.values[0].key])[0]})
		.attr("cy", function(d) {return projection([d.key,d.values[0].key])[1]})
		.zoomed();
	}
	
	function zoomed() {
		  var tiles = tile
		      .scale(zoom.scale())
		      .translate(zoom.translate())
		      ();

		  projection
		      .scale(zoom.scale() / 2 / Math.PI)
		      .translate(zoom.translate());

					d3.selectAll("circle")
					.attr("cx", function(d) {return projection([d.key,d.values[0].key])[0]})
					.attr("cy", function(d) {return projection([d.key,d.values[0].key])[1]})

		  var image = layer
		      .style(prefix + "transform", matrix3d(tiles.scale, tiles.translate))
		    .selectAll(".tile")
		      .data(tiles, function(d) { return d; });

		  image.exit()
		      .remove();

		  image.enter().append("img")
		      .attr("class", "tile")
		      .attr("src", function(d) { return "http://" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".tiles.mapbox.com/v3/jhubley.kllla0l7/" + d[2] + "/" + d[0] + "/" + d[1] + ".png"; })
		      .style("left", function(d) { return (d[0] << 8) + "px"; })
		      .style("top", function(d) { return (d[1] << 8) + "px"; });
		}

		

		function matrix3d(scale, translate) {
		  var k = scale / 256, r = scale % 1 ? Number : Math.round;
		  return "matrix3d(" + [k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, r(translate[0] * scale), r(translate[1] * scale), 0, 1 ] + ")";
		}

		function prefixMatch(p) {
		  var i = -1, n = p.length, s = document.body.style;
		  while (++i < n) if (p[i] + "Transform" in s) return "-" + p[i].toLowerCase() + "-";
		  return "";
		}

		

		onstateclick("data");
		createMap(crimecountByYear);
	
	
	
	}


//For Scrolling https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
function onstateclick(data) {
	$('html,body').animate({
		scrollTop : $("#line").offset().top
	}, 'slow');
	 drawchicago(data);
	 

}
/*This Method Draw Multi Line Char
 * 
Reference http://bl.ocks.org/DStruths/9c042e3a6b66048b5bd4
*/
function drawchicago(data) {
	document.getElementById("line").style.visibility = 'visible';

	var margin = {
		top : 20,
		bottom : 100,
		right : 250,
		left : 50
	}, margin1 = {
		top : 430,
		bottom : 20,
		right : 10,
		left : 40
	}, w = 1000, h = 500, width = w - margin.left - margin.right, height = h
			- margin.top - margin.bottom, height1 = h - margin1.top
			- margin1.bottom;
	// dara mul bar for All category
	drawmultiplebarchart("All");
	var parseDate = d3.time.format("%Y-%m-%d"), bisectDate = d3
			.bisector(function(d) {
				return new Date(d.key);
			}).left
	bisectValue = d3.bisector(function(d) {
		return d.key;
	}).left;
	var xScale = d3.time.scale().range([ 0, width ]), xScale1 = d3.time.scale()
			.range([ 0, width ]);
	var yScale = d3.scale.linear().range([ height, 0 ]);
	var color = d3.scale.ordinal().range(
			[ "#48A36D", "#56AE7C", "#64B98C", "#72C39B", "#80CEAA", "#80CCB3",
					"#7FC9BD", "#7FC7C6", "#7EC4CF", "#7FBBCF", "#7FB1CF",
					"#80A8CE", "#809ECE", "#8897CE", "#8F90CD", "#9788CD",
					"#9E81CC", "#AA81C5", "#B681BE", "#C280B7", "#CE80B0",
					"#D3779F", "#D76D8F", "#DC647E", "#E05A6D", "#E16167",
					"#E26962", "#E2705C", "#E37756", "#E38457", "#E39158",
					"#E29D58", "#E2AA59", "#E0B15B", "#DFB95C", "#DDC05E",
					"#DBC75F", "#E3CF6D", "#EAD67C", "#F2DE8A" ]);
	var xAxis = d3.svg.axis().scale(xScale).orient("bottom"), xAxis1 = d3.svg
			.axis().scale(xScale1).orient("bottom");
	var yAxis = d3.svg.axis().scale(yScale).orient("left");

	var line = d3.svg.line().interpolate("basis").x(function(d) {
		return xScale(new Date(d.key));
	}).y(function(d) {
		return yScale(d.values);
	}).defined(function(d) {
		return d.values;
	}); // Hiding line value defaults of 0 for missing data

	var maxY;

	var svg = d3.select("#line").append("svg").attr("width", w).attr("height",
			h).append("g").attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");
	// mouse tracking
	svg.append("rect").attr("width", width).attr("height", height).attr("x", 0)
			.attr("y", 0).attr("id", "mouse-tracker").style("fill", "white");

	// sliding part
	var context = svg.append("g").attr("transform",
			"translate(" + 0 + "," + 410 + ")").attr("class", "context");
	// clip path

	svg.append("defs").append("clipPath").attr("id", "clip").append("rect")
			.attr("width", width).attr("height", height);
	// end
	chicago_data_one = chicago_data.slice(0);
	chicago_data_one.forEach(function(d) { // Make every date in the csv data a
										// javascript date object format
		// d.date = parseDate.parse(d.date.split("T")[0]);
		d.date = new Date(d.date);

	});

	var crimes = d3.nest().key(function(d) {
		return d.primary_type;
	}).map(chicago_data_one);

	var crimecount = d3.nest().key(function(d) {
		return d.primary_type;
	}).key(function(d) {
		return parseDate(d.date)
	}).rollup(function(v) {
		return v.length;
	}).entries(chicago_data_one);
	/*
	 * var categories = color.domain().map(function(name) { // Nest the data
	 * into an array of objects with new keys
	 * 
	 * return { name: name, // "name": the csv headers except date values:
	 * crimecount.map(function(d) { // "values": which has an array of the dates
	 * and ratings crimedate = d.values; console.log(crimedate.length); return
	 * crimedate; }), // "visible": all false except for economy which is true. };
	 * });
	 */

	var categories = crimecount.map(function(crime) {
		return {
			"name" : crime.key,
			"values" : crime.values,
			"visible" : (crime.key === "BATTERY" ? true : false)
		}
	});
	// for dafault stack bar and mult bar
	drawstackbarchart("BATTERY");
	
	drawmultiplebarchart("BATTERY");
	categories.forEach(function(d) {

		d.values.sort(function(a, b) {
			var keyA = new Date(a.key), keyB = new Date(b.key);
			// Compare the 2 dates
			if (keyA < keyB)
				return -1;
			if (keyA > keyB)
				return 1;
			return 0;
		});

	});
	
	var crimeDates = d3.nest().key(function(d) {
		return d.date
	}).map(chicago_data_one);
	minmax = d3.extent(d3.keys(crimeDates), function(d) {
		return new Date(d)
	});
	xScale.domain([ new Date(minmax[0]), new Date(minmax[1]) ]);
	// xScale.domain([mindate,maxdate]);
	yScale.domain([ 0, d3.max(crimecount, function(d) {
		return d3.max(d.values, function(v) {
			return v.values
		})
	}) ]);
	xScale1.domain(xScale.domain());
	// for brush

	var brush = d3.svg.brush().x(xScale1).on("brush", brushed);
	// brush x axis
	context.append("g").attr("class", "x axis1").attr("transform",
			"translate(0," + height1 + ")").call(xAxis1);

	var contextArea = d3.svg.area().interpolate("monotone").x(function(d) {
		return xScale(new Date(d.key));
	}).y0(height1).y1(0);

	context.append("path").attr("class", "area").attr("d",
			contextArea(categories[0].values)).style("fill", "#F1F1F2");

	context.append("g").attr("class", "x brush").call(brush).selectAll("rect")
			.attr("height", height1).attr("fill", "#E6E7E8");
	// line graph

	svg.append("g").attr("class", "x axis").attr("transform",
			"translate(0," + height + ")").call(xAxis);

	svg.append("g").attr("class", "y axis").call(yAxis).append("text").attr(
			"transform", "rotate(-90)").attr("x", -10).attr("y", 6).attr("dy",
			".71em").style("text-anchor", "end").text("No Of Crimes");

	var issue = svg.selectAll(".issue").data(categories).enter().append("g")
			.attr("class", "issue");

	issue.append("path").attr("class", "line").style("pointer-events", "none") // Stop
																				// line
																				// interferring
																				// with
																				// cursor
	.attr("id", function(d) {
		return "line-" + d.name.replace(/ /g, ""); // Give line id of
													// line-(insert issue name,
													// with any spaces replaced
													// with no spaces)
	}).attr("d", function(d) {
		return d.visible ? line(d.values) : null; // If array key "visible" =
													// true then draw line, if
													// not then don't
	}).attr("clip-path", "url(#clip)")// use clip path to make irrelevant part
										// invisible
	.style("stroke", function(d) {
		return color(d.name);
	});

	// draw legend
	var legendSpace = 450 / crimecount.length; // 450/number of issues (ex. 40)

	issue.append("rect").attr("width", 10).attr("height", 10).attr("x",
			width + (margin.right / 3)- 50).attr("y", function(d, i) {
		return (legendSpace) + i * (legendSpace) - 8;
	}) // spacing
	.attr("fill", function(d) {
		return d.visible ? color(d.name) : "#F1F1F2"; // If array key
														// "visible" = true then
														// color rect, if not
														// then make it grey
	}).attr("class", "legend-box")

	.on(
			"click",
			function(d) {
				// On click make d.visible
				//console.log(d3.select("#stack").selectAll("svg"));
				if (d.visible == true) {
					//console.log(d.name.replace(/ /g, "."));

					d3.select("#stack").select(
							"svg#" + d.name.replace(/ /g, "")).remove();
					d3.select("#mbar").select(
							"svg#" + d.name.replace(/ /g, "")).remove();
					
				} else {
					drawstackbarchart(d.name);
					drawmultiplebarchart(d.name);
				}

				d.visible = !d.visible; // If array key for this data selection
										// is "visible" = true then make it
										// false, if false then make it true

				// call the stackbar for the new selected type

				maxY = findMaxY(categories); // Find max Y rating value
												// categories data with
												// "visible"; true

				yScale.domain([ 0, maxY ]); // Redefine yAxis domain based on
											// highest y value of categories
											// data with "visible"; true
				svg.select(".y.axis").transition().call(yAxis);

				issue.select("path").transition().attr("d", function(d) {
					return d.visible ? line(d.values) : null; // If d.visible
																// is true then
																// draw line for
																// this d
																// selection
				})

				issue.select("rect").transition().attr("fill", function(d) {
					return d.visible ? color(d.name) : "#F1F1F2";
				});
			})

	.on(
			"mouseover",
			function(d) {

				d3.select(this).transition().attr("fill", function(d) {
					return color(d.name);
				});

				d3.select("#line-" + d.name.replace(/ /g, "")).transition()
						.style("stroke-width", 2.5);
			})

	.on(
			"mouseout",
			function(d) {

				d3.select(this).transition().attr("fill", function(d) {
					return d.visible ? color(d.name) : "#F1F1F2";
				});

				d3.select("#line-" + d.name.replace(/ /g, "")).transition()
						.style("stroke-width", 1.5);
			})

	issue.append("text").attr("x", width + (margin.right / 3)-35).attr("y",
			function(d, i) {
				return (legendSpace) + i * (legendSpace);
			}) // (return (11.25/2 =) 5.625) + i * (5.625)
	.text(function(d) {
		return d.name;
	}).attr("font-size","15px");

	// Hover line
	var hoverLineGroup = svg.append("g").attr("class", "hover-line");

	var hoverLine = hoverLineGroup // Create line with basic attributes
	.append("line").attr("id", "hover-line").attr("x1", 10).attr("x2", 10)
			.attr("y1", 0).attr("y2", height + 10).style("pointer-events",
					"none") // Stop line interferring with cursor
			.style("opacity", 1e-6); // Set opacity to zero

	var hoverDate = hoverLineGroup.append('text').attr("class", "hover-text")
			.attr("y", height - (height - 40)) // hover date text position
			.attr("x", width - 150) // hover date text position
			.style("fill", "#E6E7E8");

	/*
	 * var columnNames = d3.keys(data[0]) //grab the key values from your first
	 * data row //these are the same as your column names .slice(1); //remove
	 * the first column name (`date`);
	 */
	var focus = issue.select("g") // create group elements to house tooltip
									// text
	.data(d3.keys(crimes)) // bind each column name date to each g element
	.enter().append("g") // create one <g> for each columnName
	.attr("class", "focus");

	focus.append("text") // http://stackoverflow.com/questions/22064083/d3-js-multi-series-chart-with-y-value-tracking
	.attr("class", "tooltip").attr("x", width + 20) // position tooltips
	.attr("y", function(d, i) {
		return (legendSpace) + i * (legendSpace);
	}); // (return (11.25/2 =) 5.625) + i * (5.625) // position tooltips

	// Add mouseover events for hover line.
	d3.select("#mouse-tracker") // select chart plot background rect
								// #mouse-tracker
	.on("mousemove", mousemove) // on mousemove activate mousemove function
								// defined below
	.on("mouseout", function() {
		hoverDate.text(null) // on mouseout remove text for hover date

		d3.select("#hover-line").style("opacity", 1e-6); // On mouse out
															// making line
															// invisible
	});
	var crimecountbydate = d3.nest().key(function(d) {
		return new Date(d.date);
	}).key(function(d) {
		return d.primary_type;
	}).rollup(function(v) {
		return v.length;
	}).entries(chicago_data_one);
	// console.log(crimecountbydate);
	var crimecountdate = d3.nest().key(function(d) {
		return d.date
	}).key(function(d) {
		return d.primary_type;
	}).rollup(function(v) {
		return v.length;
	}).entries(chicago_data_one);
	var crimesarr = d3.keys(crimes);
	function mousemove() {
		var mouse_x = d3.mouse(this)[0]; // Finding mouse x position on rect
		var graph_x = xScale.invert(mouse_x); // 

		// var mouse_y = d3.mouse(this)[1]; // Finding mouse y position on rect
		// var graph_y = yScale.invert(mouse_y);
		// console.log(graph_x);

		var format = d3.time.format('%b %Y'); // Format hover date text to
												// show three letter month and
												// full year

		hoverDate.text(format(graph_x)); // scale mouse position to xScale
											// date and format it to show month
											// and year

		d3.select("#hover-line") // select hover-line and changing attributes
									// to mouse position
		.attr("x1", mouse_x).attr("x2", mouse_x).style("opacity", 1); // Making
																		// line
																		// visible

		// Legend tooltips //
		// http://www.d3noob.org/2014/07/my-favourite-tooltip-method-for-line.html

		var x0 = new Date(xScale.invert(d3.mouse(this)[0])); /*
																 * d3.mouse(this)[0]
																 * returns the x
																 * position on
																 * the screen of
																 * the mouse.
																 * xScale.invert
																 * function is
																 * reversing the
																 * process that
																 * we use to map
																 * the domain
																 * (date) to
																 * range
																 * (position on
																 * screen). So
																 * it takes the
																 * position on
																 * the screen
																 * and converts
																 * it into an
																 * equivalent
																 * date!
																 */
		var i = bisectDate(crimecountdate, x0, 1); // use our bisectDate
													// function that we declared
													// earlier to find the index
													// of our data array that is
													// close to the mouse cursor
		/*
		 * It takes our data array and the date corresponding to the position of
		 * or mouse cursor and returns the index number of the data array which
		 * has a date that is higher than the cursor position.
		 */
		d0 = crimecountdate[i - 1], d1 = crimecountdate[i];
		/*
		 * d0 is the combination of date and rating that is in the data array at
		 * the index to the left of the cursor and d1 is the combination of date
		 * and close that is in the data array at the index to the right of the
		 * cursor. In other words we now have two variables that know the value
		 * and date above and below the date that corresponds to the position of
		 * the cursor.
		 */
		// console.log(d0);
		var d = x0 - d0.key > d1.key - x0 ? d1 : d0;

		arr = d.values;
		//console.log(arr);
		// console.log("dd",d.values);
		// console.log(d);
		/*
		 * The final line in this segment declares a new array d that is
		 * represents the date and close combination that is closest to the
		 * cursor. It is using the magic JavaScript short hand for an if
		 * statement that is essentially saying if the distance between the
		 * mouse cursor and the date and close combination on the left is
		 * greater than the distance between the mouse cursor and the date and
		 * close combination on the right then d is an array of the date and
		 * close on the right of the cursor (d1). Otherwise d is an array of the
		 * date and close on the left of the cursor (d0).
		 */

		// d is now the data row for the date closest to the mouse position
		focus.select("text").text(function(columnName) {
			// because you didn't explictly set any data on the <text>
			// elements, each one inherits the data from the focus <g>
			// var value=" ";
			// console.log(arr, columnName);
			// var j = bisectValue(arr, columnName,1);

			// console.log(crimesarr.indexOf(columnName),columnName);
			// console.log(j);
			// console.log(arr[j-1]);
			// return arr[j-1].values;
			if(crimesarr.indexOf(columnName)<arr.length)
				return arr[crimesarr.indexOf(columnName)].values;
			
		});
	}

	// for brusher of the slider bar at the bottom
	function brushed() {

		var temp = brush.empty() ? xScale1.domain() : brush.extent(); // If
																		// brush
																		// is
																		// empty
																		// then
																		// reset
																		// the
																		// Xscale
																		// domain
																		// to
																		// default,
																		// if
																		// not
																		// then
																		// make
																		// it
																		// the
																		// brush
																		// extent;

		xScale.domain([ new Date(temp[0]), new Date(temp[1]) ]);
		svg.select(".x.axis") // replot xAxis with transition when brush used
		.transition().call(xAxis);

		maxY = findMaxY(categories); // Find max Y rating value categories
										// data with "visible"; true
		yScale.domain([ 0, maxY ]); // Redefine yAxis domain based on highest y
									// value of categories data with "visible";
									// true

		svg.select(".y.axis") // Redraw yAxis
		.transition().call(yAxis);

		issue.select("path") // Redraw lines based on brush xAxis scale and
								// domain
		.transition().attr("d", function(d) {
			return d.visible ? line(d.values) : null; // If d.visible is true
														// then draw line for
														// this d selection
		});

	}
	;

	function findMaxY(data) { // Define function "findMaxY"
		var maxYValues = data.map(function(d) {
			if (d.visible) {
				return d3.max(d.values, function(value) { // Return max rating
															// value
					return value.values;
				})
			}
		});
		return d3.max(maxYValues);
	}
}
/*This Method Draw Normalize Stack Bar Chart
 * 
Arrest vs Not Arrest*/
function drawstackbarchart(category) {

	document.getElementById("stack").style.visibility = 'visible';

	var margin = {
		top : 50,
		right : 100,
		bottom : 40,
		left : 50
	};
	var width = 700 - margin.left - margin.right;
	var height = 440 - margin.top - margin.bottom;


	var x = d3.scale.ordinal().rangeRoundBands([ 0, width ], .05);
	var y = d3.scale.linear().rangeRound([ height, 0 ]);
	var color = d3.scale.ordinal().range([ "#8a89a6", "#7b6888" ]);
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var yAxis = d3.svg.axis().scale(y).orient("left").tickFormat(
			d3.format(".0%"));

	// create canvas

	var svg = d3.select("#stack").append("svg:svg").attr("id",
			category.replace(/ /g, "")).attr("class",
			category.replace(/ /g, "")).attr("width",
			width + margin.left + margin.right).attr("height",
			height + margin.top + margin.bottom).append("svg:g").attr(
			"transform", "translate(" + margin.left + "," + margin.top + ")");
	svg.append("text").attr("x", width / 4).attr("y", -15).attr("dy", ".35em")
			.text("percentage of " + category + " that result in an arrest").style("font-weight","bold");
	color.domain([ "Not Arrest", "Arrest" ]);
	var parseDate = d3.time.format("%Y-%m-%d"), formateDate = d3.time
			.format("%Y");
	chicago_data1 = chicago_data.filter(function(d) {
		if (d.primary_type == category)
			return d;
	})
	console.log(chicago_data1.length);

	var CrimeByYear = d3.nest().key(function(d) {
		return formateDate(d.date);
	}).entries(chicago_data1);

	var year = CrimeByYear.map(function(d) {
		return d.key;
	});
	x.domain(year)

	CrimeByYear = CrimeByYear.map(function(d) {

		return d3.nest().key(function(c) {
			return c.arrest
		}).rollup(function(v) {
			return v.length;
		}).entries(d.values);

	});

	CrimeByYear.forEach(function(d, ii) {
		if (d.length == 1) {
			var y0 = 0;
			d.year = year[ii];
			d.arrest = color.domain().map(function(temp, i) {
				return {
					name : temp,
					y0 : y0,
					y1 : y0 += +d[0].values
				};
			});
			d.arrest.forEach(function(d) {
				d.y0 /= y0;
				d.y1 /= y0;
			});

		} else {
			var y0 = 0;
			d.year = year[ii];
			d.arrest = color.domain().map(function(temp, i) {
				return {
					name : temp,
					y0 : y0,
					y1 : y0 += +d[i].values
				};
			});
			d.arrest.forEach(function(d) {
				d.y0 /= y0;
				d.y1 /= y0;
			});

		}

	});

	CrimeByYear.sort(function(a, b) {
		return b.arrest[0].y1 - a.arrest[0].y1
	});


	svg.append("g").attr("class", "x axis").attr("transform",
			"translate(0," + height + ")").call(xAxis).selectAll("text").attr(
			"y", 3).attr("x", 5).attr("dy", ".35em").attr("transform",
			"rotate(45)").style("text-anchor", "start");

	svg.append("g").attr("class", "y axis").call(yAxis);

	var years = svg.selectAll(".years").data(CrimeByYear).enter().append("g")
			.attr("class", "years").attr("transform", function(d, i) {
				return "translate(" + x(d.year) + ",0)"
			});
	years.selectAll("rect").data(function(d) {
		return d.arrest;
	}).enter().append("rect").attr("width", x.rangeBand()).attr("y",
			function(d) {
				return y(d.y1);
			}).attr("height", function(d) {
		return y(d.y0) - y(d.y1);
	}).style("fill", function(d) {
		return color(d.name);
	});
	
	var legend = svg.selectAll(".years").filter(function(d) {
		//console.log(d.year);
		if (d.year == "2016")
			return d;
	}).selectAll(".legend").data(function(d) {
		return d.arrest;
	}).enter().append("g").attr("class", "legend").attr(
			"transform",
			function(d) {
				//console.log(d);
				return "translate(" + x.rangeBand() / 2 + ","
						+ y((d.y0 + d.y1) / 2) + ")";
			});

	legend.append("line").attr("x2", 5);

	legend.append("text").attr("x", 7).attr("dy", ".35em").text(function(d) {
		return d.name;
	}).style("font-weight","bold");

	}
/*This Method drwal Daily Rhythym For Crime
 * https://www.socrata.com/blog/crime-time-visualizing-crime-data-chicago/
 * */

function drawmultiplebarchart(category) {
	var w = 800,
 	 h = 200,
 	barwidth = w/25,
 	lableh = 150;

	if(category == "All")
		{
		document.getElementById("mainbar").style.visibility = 'visible';
	
		chicago_data_two = orignal_data.splice(0);
		console.log("lengthhh",chicago_data_two.length);
		 var svg = d3.select("#mainbar").append("svg")
			 .attr("width",w)
			 .attr("height",h);
		 var x = d3.scale.ordinal().rangeRoundBands([0, w], .9).domain(["6am","noon","6pm"]);
		 
		 var xAxis = d3.svg.axis()
		 		.scale(x)
		 		.innerTickSize(-h)
		 		.outerTickSize(0)
		    	.orient("top");
		 svg.append("g")
	     	.attr("class", "x axis")
	     	.attr("transform", "translate(0," + 23 + ")")
	     	.style("stroke","#000")
	     	.style("fill","#000")
	     	.call(xAxis);
		
		}
	else{
		document.getElementById("mbar").style.visibility = 'visible';
		
		chicago_data_two = chicago_data.filter(function(d) {
			if (d.primary_type == category)
				return d;
		});
		var svg = d3.select("#mbar").append("svg"). attr("id",category.replace(/ /g, "")).attr("class",category.replace(/ /g, ""))
			 .attr("width",w)
			 .attr("height",h);
		var x = d3.scale.ordinal().rangeRoundBands([0, w], .9).domain(["."," .",". "]);
		var xAxis = d3.svg.axis()
 		.scale(x)
 		.innerTickSize(-h)
 		.outerTickSize(0)
    	.orient("top");
		svg.append("g")
		.attr("class", "x axis")
		//.attr("transform", "translate(0," + 5 + ")")
		.style("stroke","#000")
		.style("fill","#000")
		.call(xAxis);
	
	}
	

	var parseDate = d3.time.format("%d-%m-%YT%H:%M:%"), 
	formateDate = d3.time.format("%H");
	
	chicago_data_two.forEach(function(d) { // Make every date in the csv data a
										// javascript date object format
		d.date = new Date(d.date);
		
	});

	 var CrimeByHour = d3.nest()
	 	.key(function(d) {return formateDate(d.date); })
	 	.rollup(function(v){return v.length;})
	 	.entries(chicago_data_two);
	 CrimeByHour.sort(function(a, b) {
			return a.key - b.key
		});
	// console.log(CrimeByHour);
	
	 var y = d3.scale.linear()
	 			.domain([0,d3.max(CrimeByHour,function(d){return d.values})])
	 			.range([0,lableh]);
	// console.log(d3.keys(CrimeByHour));
	/* var x = d3.scale.linear()
     			.range([0, w])
     			.domain([0,23]);*/
	 
	 var x1 = d3.scale.linear().domain([0,24]).range([0, w]);
	var xAxis1 = d3.svg.axis()
		.scale(x1)	
		.orient("bottom");
		
	svg.append("g")
		.attr("class", "taxis")
		.attr("transform", "translate(-5," + 180 + ")")
		.style("stroke","gray")
		.style("fill","gray")
		.call(xAxis1)
		.selectAll("text")
		.style("stroke","white")
		.style("fill","white");
		
		
	 
	 
	 
	 
	 svg.append("text")
	 	.attr("x",50)
	 	.attr("y",50)
	 	.text(category)
	 	.style("font-weight","bold")
	 	.style("fill","gray");
	 
	 
	 var bar = svg.selectAll("g.bar")
	 			.data(CrimeByHour)
	 			.enter().append("g")
	 			.attr("transform", function(d,i) {
	 			    return "translate(" + x1(i)+ "," + 180 + ")";
	 			})
	 			.classed("bar", true);
	 bar.append("rect")
	 	.attr("width",(barwidth-1))
	 	.attr("height",function(d){return y(d.values);})
	 	.attr("y",function(d){return -y(d.values)})
	 	.attr("fill","steelblue");


}
