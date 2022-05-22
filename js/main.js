mapboxgl.accessToken =
            'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
        let map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/dark-v10',
            zoom: 11, // starting zoom
            center: [-122.32666, 47.63343] // starting center
        });

        map.on('load', () => { //simplifying the function statement: arrow with brackets to define a function

            map.addSource('electricity-tiles', {
                'type': 'raster',
                'tiles': [
                    'tiles/electricity/{z}/{x}/{y}.png'
                ],
                'tileSize': 256,
                'attribution': 'Map tiles designed by Solomon Kim</a>'
            });
            
            map.addSource('naturalgas-tiles', {
                'type': 'raster',
                'tiles': [
                    'tiles/naturalgas/{z}/{x}/{y}.png'
                ],
                'tileSize': 256,
                'attribution': 'Map tiles designed by Solomon Kim'
            });

            map.addLayer({
                'id': 'electricity',
                'type': 'raster',
                'layout': {
                    'visibility': 'none'
                },
                'source': 'electricity-tiles'
            });

            map.addLayer({
                'id': 'naturalgas',
                'type': 'raster',
                'layout': {
                    'visibility': 'none'
                },
                'source': 'naturalgas-tiles' 
            })

        });


        // After the last frame rendered before the map enters an "idle" state.
        map.on('idle', () => {
            // If these two layers were not added to the map, abort
            if (!map.getLayer('electricity') || !map.getLayer('naturalgas')) {
                return;
            }

            // Enumerate ids of the layers.
            const toggleableLayerIds = ['naturalgas', 'electricity'];

            // Set up the corresponding toggle button for each layer.
            for (const id of toggleableLayerIds) {
                // Skip layers that already have a button set up.
                if (document.getElementById(id)) {
                    continue;
                }

                // Create a link.
                const link = document.createElement('a');
                link.id = id;
                link.href = '#';
                link.textContent = id;
                link.className = 'inactive';

                // Show or hide layer when the toggle is clicked.
                link.onclick = function (e) {
                    const clickedLayer = this.textContent;
                    // preventDefault() tells the user agent that if the event does not get explicitly handled, 
                    // its default action should not be taken as it normally would be.
                    e.preventDefault();
                    // The stopPropagation() method prevents further propagation of the current event in the capturing 
                    // and bubbling phases. It does not, however, prevent any default behaviors from occurring; 
                    // for instance, clicks on links are still processed. If you want to stop those behaviors, 
                    // see the preventDefault() method.
                    e.stopPropagation();

                    const visibility = map.getLayoutProperty(
                        clickedLayer,
                        'visibility'
                    );

                    // Toggle layer visibility by changing the layout object's visibility property.
                    // if it is currently visible, after the clicking, it will be turned off.
                    if (visibility === 'visible') {
                        map.setLayoutProperty(clickedLayer, 'visibility', 'none');
                        this.className = '';
                    } else { //otherise, it will be turned on.
                        this.className = 'active';
                        map.setLayoutProperty(
                            clickedLayer,
                            'visibility',
                            'visible'
                        );
                    }
                };

                // in the menu place holder, insert the layer links.
                const layers = document.getElementById('menu');
                layers.appendChild(link);
            }
        });

        // const stateLegendEl = document.getElementById('state-legend');
        // const countyLegendEl = document.getElementById('county-legend');
        // map.on('zoom', () => {
        // if (map.getZoom() > zoomThreshold) {
        //         stateLegendEl.style.display = 'none';
        //         countyLegendEl.style.display = 'block';
        //     } else {
        //         stateLegendEl.style.display = 'block';
        //         countyLegendEl.style.display = 'none';
        //     }
        // }); 