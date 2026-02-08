"Before implementation, please analyze the project's existing UI components (buttons, inputs, cards), color palette (primary/secondary colors), and typography in global.css or tailwind.config.js. I want the new pages to inherit the exact look and feel of the current website."

Task 1: Setup API Layer (generalSiteApi)
(لم يتغير شيء هنا لأنها مهمة برمجية بحتة)

Goal: Create generalSiteApi.js in the services folder. Prompt:

Create functions using Axios/Fetch:

getServicesData: GET .../site/home (Extract data[0].AdditionService).

sendContactForm: POST .../site/contact (Body: {name, mobile, email, body}).

getTermsAndConditions: GET .../site/term.

Ensure error handling is generic to fit the app's standard error reporting.

Task 2: Create Services Page (UI & Design)
Goal: Create /services page matching the site's branding. Prompt:

Use the global Layout or wrap content with existing Header and Footer.

Fetch data using generalSiteApi.getServicesData.

Design Requirements:

Grid Layout: Display services in a responsive grid (e.g., 3 columns on desktop, 1 on mobile) matching the spacing used in other lists.

Cards: reuse the project's existing Card component if available. If not, style the service cards to match the shadow, border-radius, and background color of other items in the app.

Typography: Display the 'name' using the site's standard heading styles (H3 or H4) and the 'price' in the site's Primary Color to make it pop.

Images: Ensure service images have the same aspect ratio and object-fit: cover settings as other images in the site.

Task 3: Create Contact Us Page (UI & Design)
Goal: Create /contact-us with consistent form styling. Prompt:

Create a form with fields: Name, Mobile, Email, Body.

Design Requirements:

Inputs: Crucial: Do not create standard HTML inputs. Use the project's custom Input or TextField components to ensure the borders, padding, and focus states match the Login/Register forms.

Buttons: Use the project's main Button component (e.g., <Button variant="primary">) for the submit action.

Layout: Center the form or place it in a container that aligns with the site's max-width.

Feedback: Use the app's existing Toast or Alert system to show success/error messages, not a simple window.alert.

Task 4: Create Legal Pages (UI & Design)
Goal: Create /privacy-policy and /terms-and-conditions. Prompt:

Fetch content from generalSiteApi.getTermsAndConditions.

Design Requirements:

Container: Wrap the text in the site's standard Container to ensure correct margins from the edges.

Typography: The content comes as HTML. Apply a class (e.g., prose if using Tailwind, or a scoped CSS class) to ensure paragraphs <p>, headings, and lists have readable line-height and font-size consistent with the rest of the site's textual content.

Colors: Ensure the text color provides good contrast and matches the site's body text color (e.g., dark gray instead of pure black if that's the theme).