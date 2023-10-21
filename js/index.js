document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('github-form');
  const searchInput = document.getElementById('search');
  const userList = document.getElementById('user-list');
  const reposList = document.getElementById('repos-list');

  form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const searchTerm = searchInput.value;
      if (!searchTerm) {
          alert('Please enter a search term.');
          return;
      }

      userList.innerHTML = '';
      reposList.innerHTML = '';

      try {
          const usersResponse = await searchUsers(searchTerm);

          if (usersResponse.items.length === 0) {
              alert('No users found.');
              return;
          }

          usersResponse.items.forEach((user) => {
              // Filter users whose first letter of login matches the entered letter
              if (user.login.charAt(0).toLowerCase() === searchTerm.toLowerCase()) {
                  const userItem = createUserListItem(user);
                  userList.appendChild(userItem);

                  userItem.addEventListener('click', async () => {
                      const repos = await getUserRepositories(user.login);
                      displayUserRepositories(repos);
                  });
              }
          });
      } catch (error) {
          alert('An error occurred while fetching user data.');
          console.error(error);
      }
  });

  async function searchUsers(name) {
      const response = await fetch(`https://api.github.com/search/users?q=${name}`, {
          headers: {
              'Accept': 'application/vnd.github.v3+json',
          },
      });
      if (!response.ok) {
          throw new Error('Failed to fetch users');
      }
      return response.json();
  }

  function createUserListItem(user) {
      const userItem = document.createElement('li');
      userItem.textContent = user.login;
      userItem.classList.add('user-item');
      return userItem;
  }

  async function getUserRepositories(username) {
      const response = await fetch(`https://api.github.com/users/${username}/repos`, {
          headers: {
              'Accept': 'application/vnd.github.v3+json',
          },
      });
      if (!response.ok) {
          throw new Error('Failed to fetch user repositories');
      }
      return response.json();
  }

  function displayUserRepositories(repositories) {
      reposList.innerHTML = '';
      repositories.forEach((repo) => {
          const repoItem = document.createElement('li');
          repoItem.textContent = repo.name;
          repoItem.classList.add('repo-item');
          reposList.appendChild(repoItem);
      });
  }
});
