document.addEventListener('DOMContentLoaded', function () {
    const movieList = document.getElementById('movie-list');
    const addMovieForm = document.getElementById('add-movie-form');

    function fetchMovies() {
        fetch('http://localhost:5000/movies')
            .then(response => response.json())
            .then(data => {
                // Clear existing movie list
                movieList.innerHTML = '';

                // Populate movie list
                data.forEach(movie => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    listItem.textContent = `${movie.title} - ${movie.release_date}`;
                    movieList.appendChild(listItem);

                    // Add delete button for each movie
                    const deleteButton = document.createElement('button');
                    deleteButton.className = 'btn btn-danger btn-sm ml-2';
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', () => deleteMovie(movie.id));
                    listItem.appendChild(deleteButton);

                    // Add update button for each movie
                    const updateButton = document.createElement('button');
                    updateButton.className = 'btn btn-primary btn-sm ml-2';
                    updateButton.textContent = 'Update';
                    updateButton.addEventListener('click', () => updateMovieForm(movie.id, movie.title, movie.release_date));
                    listItem.appendChild(updateButton);
                });
            })
            .catch(error => console.error('Error fetching movies:', error));
    }

    function createMovie(title, release_date) {
        fetch('http://localhost:5000/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, release_date })
        })
        .then(response => {
            if (response.ok) {
                fetchMovies(); // Refresh movie list after creation
                addMovieForm.reset();
            } else {
                console.error('Failed to create movie:', response.statusText);
            }
        })
        .catch(error => console.error('Error creating movie:', error));
    }

    function updateMovie(id, title, release_date) {
        console.log(title, release_date);
        if (title && release_date) {
            fetch(`http://localhost:5000/movies/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: title, release_date: release_date })
            })
            .then(response => {
                if (response.ok) {
                    fetchMovies(); // Refresh movie list after update
                    // claear form
                    addMovieForm.reset();
                } else {
                    console.error('Failed to update movie:', response.statusText);
                }
            })
            .catch(error => console.error('Error updating movie:', error));
        }
    }

    function deleteMovie(id) {
        if (confirm('Are you sure you want to delete this movie?')) {
            fetch(`http://localhost:5000/movies/${id}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    fetchMovies(); // Refresh movie list after deletion
                } else {
                    console.error('Failed to delete movie:', response.statusText);
                }
            })
            .catch(error => console.error('Error deleting movie:', error));
        }
    }
    
    function updateMovieForm(id, title, release_date){
        addMovieForm.dataset.action = 'update';
        addMovieForm.dataset.movieId = id;
        document.getElementById('movie-id').value = id;
        document.getElementById('title').value = title;
        document.getElementById('release-date').value = release_date;
        document.getElementById('submit-button').innerText = 'Update';
        // updateMovie(id, title, release_date)

    }
    const updateButtons = document.querySelectorAll('.btn-update');
    updateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const listItem = button.parentElement;
            const movieId = listItem.dataset.movieId;
            const title = listItem.dataset.title;
            const releaseDate = listItem.dataset.releaseDate;

            addMovieForm.dataset.action = 'update';
            addMovieForm.dataset.movieId = movieId;
            document.getElementById('movie-id').value = movieId;
            document.getElementById('title').value = title;
            document.getElementById('release-date').value = releaseDate;

            document.getElementById('submit-button').innerText = 'Update';
        });
    });

    fetchMovies();
    if (addMovieForm) {
        addMovieForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent form submission

            const formData = new FormData(addMovieForm);
            const title = formData.get('title');
            const releaseDate = formData.get('release-date');
            const movieId = formData.get('movie-id');

            if (addMovieForm.dataset.action === 'create') {
                createMovie(title, releaseDate);
            } else if (addMovieForm.dataset.action === 'update') {
                updateMovie(movieId, title, releaseDate);
            }
        });
    }
});