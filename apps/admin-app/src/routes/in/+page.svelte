<script>
  import { page } from "$app/stores";
  import { isDarkMode } from "$lib/themeStore"; // Import dark mode state

  $: darkMode = $isDarkMode; // Watch for changes in dark mode state
</script>

<main class={darkMode ? "dark" : "light"}></main>

<style>
  /* Root variables for light and dark modes */
  :root {
    --light-bg-color: #f8f9fa; /* Light grayish background */
    --dark-bg-color: #1a1a1a; /* Dark background */
    --light-primary-text-color: #333; /* Dark text for light mode */
    --dark-primary-text-color: #f0f0f0; /* Light text for dark mode */
    --accent-color: #0056b3; /* Blue for links and actions */
    --hover-color: #003366; /* Darker blue for hover effect */
    --button-bg-color: #4caf50; /* Green for button */
    --button-hover-color: #45a049; /* Slightly darker green for button hover */
    --font-family: "Helvetica Neue", Arial, sans-serif; /* Clean font family */
  }

  /* Main layout styling */
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    font-family: var(--font-family);
    min-height: 100vh;
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
  }

  /* Light Mode */
  .light {
    background-color: var(--light-bg-color);
    color: var(--light-primary-text-color);
  }

  /* Dark Mode */
  .dark {
    background-color: var(--dark-bg-color);
    color: var(--dark-primary-text-color);
  }

  /* Heading styling */
  h1 {
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
  }

  .light h1 {
    color: var(--light-primary-text-color);
  }

  .dark h1 {
    color: var(--dark-primary-text-color);
  }

  /* Paragraph styling */
  p {
    font-size: 1.1rem;
    margin-bottom: 1.8rem;
    line-height: 1.6;
  }

  .light p {
    color: var(--light-primary-text-color);
  }

  .dark p {
    color: var(--dark-primary-text-color);
  }

  /* Form for logout button */
  form {
    display: flex;
    justify-content: center;
  }

  /* Button styling */
  button {
    padding: 0.75em 1.5em;
    background-color: var(--button-bg-color);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: var(--button-hover-color);
  }
</style>
