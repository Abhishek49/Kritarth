$(function() {
			
				$( '#ri-grid' ).gridrotator( {
					rows : 4,
					columns : 8,
					maxStep : 2,
					interval : 2000,
					w1024 : {
						rows : 6,
						columns : 4
					},
					w768 : {
						rows : 5,
						columns : 5
					},
					w480 : {
						rows : 6,
						columns : 4
					},
					w320 : {
						rows : 7,
						columns : 4
					},
					w240 : {
						rows : 7,
						columns : 3
					},
				} );
			
			});