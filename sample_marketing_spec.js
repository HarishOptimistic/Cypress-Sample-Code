describe('Marketing test', () => {
  beforeEach(() => {
    cy.MarketingInit();
    cy.server()
  })
  it('Campaign overview', () => {
    cy.route('GET','/marketing/campaigns').as('campaigns')
    cy.get('h2').contains("Campaign Overview");
    cy.get('th[id="name"]').contains('Name')
    cy.get('th[id="emails"]').contains('Emails')
    cy.get('th[id="unique_opens"]').contains('Unique Opens')
    cy.get('th[id="unique_clicks"]').contains('Unique Clicks')
    cy.get('th[id="sent"]').contains('Sent')
    cy.get('th[id="action"]').contains('Action')
    cy.wait('@campaigns');
    cy.get(`@campaigns`).then( (xhr) => {
      expect(xhr.method).to.eq('GET')
      expect(xhr.url).to.eq("/marketing/campaigns")
      expect(xhr.status).to.eq(200)
      expect(xhr.requestHeaders).to.have.property('Accept','application/json')
      expect(xhr.requestHeaders).to.have.property('Authorization')
      expect(xhr.requestHeaders).to.have.property('X-Country')
      // expect(xhr.requestHeaders).to.have.property('Content-type') // Content-type is not available in request header
      expect(xhr.response.body).to.have.property('data');
      expect(xhr.response.body).to.have.property('meta');
    });
    cy.get('.MuiTableBody-root tr').its('length')
      .should('be.lt', 31); // expected records is 30 in total, 15 assigned for now
  });

  it('Delete campaign overview', () => {
    cy.get('button[id="delete_1"]').click();
    cy.get('.sweet-alert ').contains('Delete')
    cy.get('.sweet-alert ').get(".btn-danger").contains('Delete').click();
  });

  it.only('Create campaign overview', () => {
    cy.route('GET','/marketing/email-templates').as('email-templates')
    cy.get('button[id="create_campaign"]').click();
    cy.wait('@email-templates');
    cy.get(`@email-templates`).then( (xhr) => {
      expect(xhr.method).to.eq('GET');
      expect(xhr.url).to.eq("/marketing/email-templates");
      expect(xhr.status).to.eq(200);
      expect(xhr.requestHeaders).to.have.property('Accept','application/json');
      expect(xhr.requestHeaders).to.have.property('Authorization')
      expect(xhr.requestHeaders).to.have.property('X-Country');
      expect(xhr.response).to.have.property('body');
    })
    cy.get('.sweet-alert').contains('New Campaign')
    cy.get('.sweet-alert').get('.text-muted').contains('Add New Campaign');
    cy.get('.sweet-alert').get('label').contains('Name');
    cy.get('.sweet-alert').get('input[id="name"]')
    cy.get('.sweet-alert').get('input[id="name"]').type("Actual Name");
    cy.route('POST','/marketing/campaigns').as('createCampaign')
    cy.get('button').contains('Save').click();
    // cy.get('button').contains('cancel').click();  // cancel button test
    cy.wait('@createCampaign');
    cy.get('@createCampaign').then(console.log)

    cy.get(`@createCampaign`).then( (xhr) => {
      expect(xhr.method).to.eq('POST');
      expect(xhr.url).to.eq("/marketing/campaigns");
      expect(xhr.status).to.eq(200);
      expect(xhr.requestHeaders).to.have.property('Accept','application/json');
      expect(xhr.requestHeaders).to.have.property('Authorization')
      expect(xhr.requestHeaders).to.have.property('X-Country');
      expect(xhr.request).to.have.property('body').to.have.property('name');
      expect(xhr.request).to.have.property('body').to.have.property('template_id');
      expect(xhr.response).to.have.property('body');
    })
    cy.get('.sweet-alert').contains('Created')
    cy.get('.sweet-alert').contains('Added Successfully')
    cy.get('button').contains('Done').click();
  });
})
