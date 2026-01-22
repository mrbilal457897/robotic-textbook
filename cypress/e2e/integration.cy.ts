describe('Physical AI Textbook - Integration Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    // Clear localStorage to start fresh
    cy.clearLocalStorage();
  });

  describe('T127a: Homepage loads and renders all 6 sections', () => {
    it('should load homepage without errors', () => {
      cy.url().should('include', '/');
      cy.contains('Physical AI & Humanoid Robotics').should('be.visible');
    });

    it('should render all 6 homepage sections', () => {
      // Hero section
      cy.contains(/Welcome|Introduction|Physical AI/i).should('be.visible');

      // Course modules section
      cy.contains(/Module|Course/i).should('be.visible');

      // Learning objectives
      cy.contains(/Learn|Objective/i).should('be.visible');

      // Why Physical AI
      cy.contains(/Why|Importance/i).should('be.visible');

      // Hardware requirements
      cy.contains(/Hardware|Requirement|Computer/i).should('be.visible');

      // Call to action
      cy.get('button, a[href*="module"], a[href*="docs"]').should('have.length.greaterThan', 0);
    });

    it('should have proper navigation structure', () => {
      cy.get('nav, [role="navigation"]').should('exist');
      cy.get('[role="menuitem"], nav a').should('have.length.greaterThan', 0);
    });
  });

  describe('T127b: Navigation between modules works', () => {
    it('should navigate to module when module card clicked', () => {
      cy.get('[class*="module"], [class*="card"]')
        .first()
        .click();

      cy.url().should('include', '/module');
      cy.contains(/Module|Content|Topic/i).should('be.visible');
    });

    it('should navigate back to homepage from module', () => {
      cy.get('[class*="module"], [class*="card"]')
        .first()
        .click();

      cy.get('a:contains("Home"), [aria-label*="Home"]').first().click({ force: true });
      cy.url().should('include', '/');
    });

    it('should display module content page correctly', () => {
      cy.get('[class*="module"], [class*="card"]')
        .first()
        .click();

      cy.contains(/Content|Topic|Lesson/i).should('be.visible');
      cy.get('[class*="sidebar"], [role="navigation"]').should('be.visible');
    });
  });

  describe('T127c: Complete quiz flow', () => {
    it('should start quiz and display first question', () => {
      cy.contains(/quiz|assessment/i).click({ force: true });
      cy.contains(/Start Quiz|Begin|Take Quiz/i).click({ force: true });

      cy.contains(/Question|What|Which|How/i).should('be.visible');
      cy.get('input[type="radio"], button[class*="option"]').should('have.length.greaterThan', 0);
    });

    it('should answer questions and navigate through quiz', () => {
      cy.contains(/quiz|assessment/i).click({ force: true });
      cy.contains(/Start Quiz|Begin|Take Quiz/i).click({ force: true });

      // Answer first question
      cy.get('input[type="radio"], button[class*="option"]')
        .first()
        .click({ force: true });

      // Move to next question
      cy.contains(/Next|Continue/i).click({ force: true });
      cy.contains(/Question|What|Which|How/i).should('be.visible');
    });

    it('should submit quiz and display results', () => {
      cy.contains(/quiz|assessment/i).click({ force: true });
      cy.contains(/Start Quiz|Begin|Take Quiz/i).click({ force: true });

      // Answer all questions quickly
      for (let i = 0; i < 10; i++) {
        cy.get('input[type="radio"], button[class*="option"]')
          .first()
          .click({ force: true });

        if (i < 9) {
          cy.contains(/Next|Continue/i).click({ force: true });
        }
      }

      // Submit quiz
      cy.contains(/Submit|Finish|Complete/i).click({ force: true });

      // Results should display
      cy.contains(/Score|Result|Passed|Failed/i).should('be.visible');
    });
  });

  describe('T127d: Quiz retake', () => {
    it('should allow quiz retake with reset answers', () => {
      cy.contains(/quiz|assessment/i).click({ force: true });
      cy.contains(/Start Quiz|Begin|Take Quiz/i).click({ force: true });

      // Answer and submit
      cy.get('input[type="radio"], button[class*="option"]')
        .first()
        .click({ force: true });
      cy.contains(/Submit|Finish|Complete/i).click({ force: true });

      // Results page should show retake option
      cy.contains(/Retake|Try Again|Reset/i).click({ force: true });

      // Should be back at first question
      cy.contains(/Question|What|Which|How/i).should('be.visible');
      cy.get('input[type="radio"], button[class*="option"]').first().should('not.be.checked');
    });
  });

  describe('T127e: GitHub login flow', () => {
    it('should redirect to GitHub OAuth when login clicked', () => {
      cy.contains(/Login|Sign In|GitHub/i).click({ force: true });

      // Should redirect to GitHub
      cy.url().should('include', 'github.com');
    });
  });

  describe('T127f: User profile displays when authenticated', () => {
    it('should display user avatar after login', () => {
      cy.window().then((win) => {
        // Simulate authenticated user in localStorage
        win.localStorage.setItem('user', JSON.stringify({
          id: '123',
          name: 'Test User',
          avatar: 'https://example.com/avatar.jpg'
        }));
      });

      cy.reload();
      cy.get('[class*="avatar"], [class*="profile"]').should('be.visible');
    });
  });

  describe('T127g: Logout', () => {
    it('should clear user session on logout', () => {
      cy.window().then((win) => {
        win.localStorage.setItem('user', JSON.stringify({
          id: '123',
          name: 'Test User',
          avatar: 'https://example.com/avatar.jpg'
        }));
      });

      cy.reload();
      cy.contains(/Logout|Sign Out/i).click({ force: true });

      cy.get('[class*="avatar"], [class*="profile"]').should('not.exist');
    });
  });

  describe('T127h: Search functionality', () => {
    it('should open search when keyboard shortcut pressed', () => {
      cy.get('body').type('{ctrl}k');
      cy.get('[class*="search"], input[type="search"]').should('be.visible');
    });

    it('should display search results', () => {
      cy.get('body').type('{ctrl}k');
      cy.get('input[type="search"], [class*="search"] input').type('ROS');

      cy.contains(/result|ROS/i, { timeout: 3000 }).should('be.visible');
    });

    it('should navigate to result when clicked', () => {
      cy.get('body').type('{ctrl}k');
      cy.get('input[type="search"], [class*="search"] input').type('ROS');

      cy.get('[class*="result"], a[class*="search"]').first().click({ force: true });
      cy.url().should('not.include', 'search');
    });
  });

  describe('T127i: Language switching', () => {
    it('should switch language when option selected', () => {
      cy.get('[class*="language"], select, button:contains("English")').first().click({ force: true });
      cy.contains(/العربية|Arabic/i).click({ force: true });

      cy.url().should('include', '/ar/');
    });

    it('should update content when language switched', () => {
      cy.visit('/ar/');
      cy.get('html').should('have.attr', 'lang', 'ar');
    });
  });

  describe('T127j: RTL layout for Arabic', () => {
    it('should apply RTL direction for Arabic', () => {
      cy.visit('/ar/');
      cy.get('html').should('have.attr', 'dir', 'rtl');
    });

    it('should mirror layout correctly for RTL', () => {
      cy.visit('/ar/');
      cy.get('[class*="sidebar"]').should('have.css', 'order');
      cy.get('[class*="main"]').should('have.css', 'order');
    });
  });

  describe('T127k: Cookie banner', () => {
    it('should display cookie banner on first visit', () => {
      cy.clearLocalStorage('cookieConsent');
      cy.visit('/');

      cy.contains(/Cookie|Consent|Privacy/i).should('be.visible');
    });

    it('should hide banner after accepting', () => {
      cy.clearLocalStorage('cookieConsent');
      cy.visit('/');

      cy.contains(/Accept All|Accept/i).click({ force: true });
      cy.contains(/Cookie|Consent|Privacy/i).should('not.exist');
    });
  });

  describe('T127l: Cookie preferences persist', () => {
    it('should persist preferences on reload', () => {
      cy.clearLocalStorage('cookieConsent');
      cy.visit('/');

      // Set preferences
      cy.contains(/Customize|Preferences/i).click({ force: true });
      cy.get('input[type="checkbox"]').first().check({ force: true });
      cy.contains(/Save|Confirm/i).click({ force: true });

      // Reload and verify
      cy.reload();
      cy.contains(/Cookie|Consent|Privacy/i).should('not.exist');
    });
  });

  describe('T127m: Reading progress tracking', () => {
    it('should track reading progress when scrolling', () => {
      cy.contains(/Module|Content/i).first().click({ force: true });

      // Scroll down 80% of page
      cy.get('body').then(($body) => {
        const height = $body.height() || 0;
        cy.scrollTo(0, height * 0.8);
      });

      // Progress should be saved
      cy.window().then((win) => {
        const progress = win.localStorage.getItem('readingProgress');
        expect(progress).to.exist;
      });
    });
  });

  describe('T127n: Previous/Next navigation', () => {
    it('should navigate to next page', () => {
      cy.contains(/Module|Content|Topic/i).first().click({ force: true });
      const initialUrl = cy.url();

      cy.contains(/Next|→|Continue/i).click({ force: true });
      cy.url().should('not.equal', initialUrl);
    });

    it('should navigate to previous page', () => {
      cy.contains(/Module|Content|Topic/i).first().click({ force: true });
      cy.contains(/Next|→|Continue/i).click({ force: true });

      const nextUrl = cy.url();
      cy.contains(/Previous|←|Back/i).click({ force: true });
      cy.url().should('not.equal', nextUrl);
    });
  });

  describe('T127o: Keyboard shortcuts', () => {
    it('should open search with Cmd/Ctrl+K', () => {
      cy.get('body').type('{ctrl}k');
      cy.get('[class*="search"], input[type="search"]').should('be.visible');
    });

    it('should close search with Escape', () => {
      cy.get('body').type('{ctrl}k');
      cy.get('[class*="search"]').should('be.visible');

      cy.get('body').type('{esc}');
      cy.get('[class*="search"]').should('not.be.visible');
    });
  });

  describe('General Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      cy.get('h1').should('have.length.greaterThan', 0);
      cy.get('h2').should('have.length.greaterThan', 0);
    });

    it('should have accessible button labels', () => {
      cy.get('button').each(($btn) => {
        expect($btn.text().length > 0 || $btn.attr('aria-label')).to.be.true;
      });
    });

    it('should have accessible form labels', () => {
      cy.get('input[type="text"], input[type="search"]').each(($input) => {
        expect($input.attr('aria-label') || $input.attr('placeholder')).to.exist;
      });
    });
  });
});
