<script>
  import { isDarkMode } from "$lib/in/themeStore"; // Import from store if globally managed

  // Initialize dark mode state
  let darkMode;

  // Use the global theme store
  $: darkMode = $isDarkMode;
</script>

<main class={darkMode ? "dark" : "light"}>
  <div class="blogpost">
    <h1>What is the approximate cost of a Solar On Grid System?</h1>

    <p>
      A Solar On Grid System is a type of solar energy system that is connected
      to the grid. In this setup, solar panels generate electricity from
      sunlight, which is then used to power the electrical appliances and
      devices in a home or building. Any excess electricity produced by the
      solar panels is fed back into the grid, often earning credits or
      compensation from the utility company through net metering. Such a system
      is recommended for homes and businesses where there are no or a few power
      outages.
    </p>

    <h2>Approximate cost of Solar On Grid System installation:</h2>

    <table>
      <thead>
        <tr>
          <th>Size of Solar On Grid System</th>
          <th>Approximate cost in Rs</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1kW</td>
          <td>72k - 77k</td>
        </tr>
        <tr>
          <td>2kW</td>
          <td>144k - 158k</td>
        </tr>
        <tr>
          <td>3kW</td>
          <td>216k - 240k</td>
        </tr>
        <tr>
          <td>4kW</td>
          <td>268k - 296k</td>
        </tr>
        <tr>
          <td>5kW</td>
          <td>336k - 370k</td>
        </tr>
      </tbody>
    </table>

    <p>
      For the requirements above 5kW, the cost per kW is approximately Rs 60k to
      Rs 65k.
    </p>

    <h2>Components of Solar On Grid System installation costing:</h2>
    <ul>
      <li>Cost of Equipment (Solar Panels, Inverters, Mounting Hardware)</li>
      <li>Installation Labor Costs</li>
      <li>Permitting and Inspection Fees</li>
      <li>Additional Expenses (Wiring, Conduit, Monitoring Systems)</li>
      <li>GST</li>
    </ul>

    <p>
      Apart from the above costs, there is a net metering cost which is around
      Rs 8k to Rs 14k.
    </p>

    <h2>Equipments of Solar On Grid System:</h2>
    <ul>
      <li>
        <strong>Solar Panels (Photovoltaic Modules)</strong>: These panels
        capture sunlight and convert it into electricity using photovoltaic
        cells made of semiconductor materials like silicon.
      </li>
      <li>
        <strong>Inverter</strong>: The inverter converts the direct current (DC)
        electricity produced by the solar panels into alternating current (AC)
        electricity, which is compatible with the electrical grid and can power
        household appliances.
      </li>
      <li>
        <strong>Mounting Structure</strong>: This component includes the racks,
        rails, and supports that secure the solar panels to the roof or ground.
        It ensures proper orientation and tilt for optimal sunlight exposure.
      </li>
      <li>
        <strong>Grid Connection and Metering System</strong>: This system allows
        the solar system to be connected to the grid. It includes a
        bi-directional meter that measures the flow of electricity between the
        solar system and the grid, enabling net metering.
      </li>
    </ul>
  </div>
</main>

<style>
  /* Root variables for light and dark modes */
  :root {
    --light-bg-color: #f8f9fa;
    --dark-bg-color: #1a1a1a;
    --light-primary-text-color: #333;
    --dark-primary-text-color: #f0f0f0;
    --accent-color: #0056b3;
    --font-family: "Helvetica Neue", Arial, sans-serif;
  }

  /* Main layout styling */
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    font-family: var(--font-family);
    transition:
      background-color 0.3s ease,
      color 0.3s ease;
  }
  div {
    max-width: 650px;
  }

  /* Light mode */
  .light {
    background-color: var(--light-bg-color);
    color: var(--light-primary-text-color);
  }

  /* Dark mode */
  .dark {
    background-color: var(--dark-bg-color);
    color: var(--dark-primary-text-color);
  }

  /* Heading styling */
  h1,
  h2 {
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
    font-weight: 600;
    line-height: 1.3;
  }

  h1 {
    text-align: center;
  }

  /* Paragraph styling */
  p {
    font-size: 1.1rem;
    margin-bottom: 1.8rem;
    line-height: 1.6;
  }

  /* List styling */
  ul,
  ol {
    margin-left: 1.5rem;
    margin-bottom: 1.5rem;
  }

  ul li,
  ol li {
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  strong {
    font-weight: 600;
  }

  /* Table styling */
  table {
    width: 100%;
    max-width: 600px;
    border-collapse: collapse;
    margin-bottom: 1.8rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 0.75rem;
    text-align: left;
  }

  th {
    background-color: var(--light-bg-color);
    font-weight: 700;
  }

  .dark th {
    background-color: var(--dark-bg-color);
  }

  /* Responsive styling */
  @media (max-width: 768px) {
    main {
      padding: 1.5rem;
    }

    h1,
    h2 {
      font-size: 2rem;
    }

    p,
    ul li,
    ol li {
      font-size: 1rem;
    }
  }
</style>
