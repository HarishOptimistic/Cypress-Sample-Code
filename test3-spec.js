/* eslint-disable no-undef */
/** ************************************************************
 * Macbook responsiveness and XHR - resquest and response check
 ************************************************************ */
describe("macbook - Couriers Department Login and Step 1", () => {
	beforeEach(() => {
		cy.server();
		cy.viewport("macbook-11");
	});

	it("Test Login Screens", () => {
		cy.passLoginScreens();
	});

	it("check main page area, logo and header visibility", () => {
		// Page's main div
		cy.get("#root").should("be.visible");
	});

	it("Header - Logo, star ratings and contact info", () => {
		// Header (3 DIV's)
		cy.get("[data-cy=header]").should("be.visible");

		// Logo area - div1
		cy.get("[data-cy=header-logo]").should("be.visible");

		// Star ratings - div2
		cy.get("[data-cy=header-starRating]")
			.should("be.visible")
			.click();
		cy.get("[data-cy=Feedbackpopup-Header]").should("be.visible");
		cy.get("[data-cy=Feedbackpopup-Body]").should("be.visible");
		cy.get(".close > span")
			.should("be.visible")
			.click();

		// Contact info - div3
		cy.get("[data-cy=header-contactInfo]").should("be.visible");
	});

	it("Stepper", () => {
		// Stepper
		cy.get("[data-cy=stepperComponent]").should("be.visible");
		cy.get(".stepper").should("be.visible");
		cy.get(".stepwizard-row > :nth-child(1)").should("be.visible");
		cy.get(":nth-child(1) > #btn-popover").should("be.visible");
		cy.get(":nth-child(1) > .stepper-title").should("be.visible");
		cy.get(":nth-child(1) > .stepper-description").should("be.visible");

		cy.get(".stepwizard-row > :nth-child(2)").should("be.visible");
		cy.get(":nth-child(2) > #btn-popover").should("be.visible");
		cy.get(":nth-child(2) > .stepper-title").should("be.visible");
		cy.get(":nth-child(2) > .stepper-description").should("be.visible");

		cy.get(".stepwizard-row > :nth-child(3)").should("be.visible");
		cy.get(":nth-child(3) > #btn-popover").should("be.visible");
		cy.get(":nth-child(3) > .stepper-title").should("be.visible");
		cy.get(":nth-child(3) > .stepper-description").should("be.visible");
	});

	it("Main area - Courier shipping type and estimated dimentions", () => {
		// Main area - Courier shipping type and estimated dimentions
		cy.get(".shipment-wrapper").should("be.visible");
		cy.get(".shipment-details-wrap").should("be.visible");
		cy.get(":nth-child(1) > h3").should("be.visible");
		cy.get(".shipment-details-wrap > :nth-child(1) > h5").should("be.visible");
		cy.get(".bottom-shipment-details > h3").should("be.visible");
		cy.get(".input-wrapper").should("be.visible");
		cy.get(".input-wrapper > :nth-child(1)").should("be.visible");
		cy.get(".input-wrapper > :nth-child(1) > h5").should("be.visible");
		cy.get(":nth-child(1) > h6").should("be.visible");
		cy.get(".input-wrapper > :nth-child(2)").should("be.visible");
		cy.get(":nth-child(2) > h6");
		cy.get(".input-wrapper > :nth-child(3)");
		cy.get(":nth-child(3) > h5").should("be.visible");
		cy.get(":nth-child(3) > h6").should("be.visible");
		cy.get(".input-wrapper > :nth-child(4)").should("be.visible");
		cy.get(":nth-child(4) > h5").should("be.visible");
		cy.get(":nth-child(4) > h6").should("be.visible");
	});

	it("Image and shipment", () => {
		// Image
		cy.get(".item-image").should("be.visible");

		// Shipment services - Add on's
		cy.get(".shipment-sevices").should("be.visible");

		// Scroll to Map and cart
		cy.scrollTo(0, 1300);
	});

	it("Map and distance with price cart", () => {
		// Map and distance with price cart
		cy.get(
			'[style="z-index: 3; position: absolute; height: 100%; width: 100%; padding: 0px; border-width: 0px; margin: 0px; left: 0px; top: 0px; touch-action: pan-x pan-y;"]'
		).should("be.visible");

		cy.get(".distance-display > :nth-child(1)").should("be.visible");
		cy.get(".distance-display > div > :nth-child(1)").should("be.visible");

		cy.get(".distance-display > div > :nth-child(2)").should("be.visible");
		cy.get(".distance-display > div > :nth-child(3)").should("be.visible");
		cy.get(".distance-display > div > .btn").should("be.visible");
		cy.get(".calc-item > p").should("be.visible");
		cy.get(".col-md-5 > p").should("be.visible");
		cy.get(".col-md-5 > p").should("be.visible");
	});

	it("Call for quote modal and Green tick bulletins", () => {
		// Click on "call for quote" to check modal
		cy.get(":nth-child(4) > .btn-offerte")
			.should("be.visible")
			.click();

		cy.checkPhoneNumberModal();

		// Green tick bulletins
		cy.get("ul > :nth-child(1)").should("be.visible");
		cy.get("ul > :nth-child(2)").should("be.visible");
		cy.get("ul > :nth-child(3)").should("be.visible");

		// HALL SERVICECODE - Modal check
		cy.get(".col-sm-12 > .btn-offerte")
			.should("be.visible")
			.click();
		cy.checkPhoneNumberModal();
	});

	it("Check department switcher and go to next page", () => {
		// Checking department switcher
		cy.get(".dropdown-toggle")
			.should("be.visible")
			.click();
		cy.get(".dropdown-menu > :nth-child(1)").should("be.visible");
		cy.get(".dropdown-menu > :nth-child(1)").should("be.visible");
		cy.get(".dropdown-toggle")
			.should("be.visible")
			.click();

		cy.scrollTo(0, 400);
		cy.route("GET", "/services/prices?*").as("services-prices");
		cy.route("POST", "/booking-service/order-synchronization").as(
			"order-synchronization"
		);
		cy.get(
			':nth-child(1) > [style="display: flex; align-content: center;"] > .checkmark > .checkmark-inner'
		)
			.should("be.visible")
			.click();

		cy.wait("@services-prices");
		cy.get("@services-prices").then(xhr => {
			expect(xhr.method).to.eq("GET");
			expect(xhr.status).to.eq(200);
			expect(xhr.url).to.match(/\?data=/);
			expect(xhr.requestHeaders).to.have.property("X-Department", `couriers`);
			expect(xhr.response.body).to.have.property("data");
			expect(xhr.response.body).to.have.property("meta");
		});

		cy.wait("@order-synchronization");
		cy.get("@order-synchronization").then(xhr => {
			expect(xhr.method).to.eq("POST");
			expect(xhr.status).to.eq(200);
			expect(xhr.requestHeaders).to.have.property("Accept", "application/json");
			expect(xhr.requestHeaders).to.have.property(
				"X-Department",
				`couriers` || `vehicles`
			);
			expect(xhr.request.body).to.have.property("data");
			expect(xhr.request.body).to.have.property("secret");
			expect(xhr.request.body).to.have.property("uuid");
			expect(xhr.response.body).to.have.property("code");
			expect(xhr.response.body).to.have.property("created_at");
			expect(xhr.response.body).to.have.property("data");
			expect(xhr.response.body).to.have.property(
				"support_code_issue_timestamp"
			);
			expect(xhr.response.body).to.have.property("updated_at");
		});

		cy.scrollTo(0, 1300);
		cy.get(".service-title")
			.should("be.visible")
			.trigger("mouseover");

		cy.get("#btn-popover > .btn-sr-yellow")
			.should("be.visible")
			.click();
	});
});

/** ************************************************************
 **************** IPad responsiveness test *********************
 ************************************************************ */

describe("ipad - Responsiveness Test - Couriers Department Login and Step 1", () => {
	beforeEach(() => {
		cy.server();
		cy.viewport(1024, 1366);
	});
	it("Check if all elements are visible on ipad", () => {
		cy.ipadResponsivenessForLoginScreens();

		// Check step1
		cy.get("[data-cy=header]").should("be.visible");
		cy.get("[data-cy=header-logo] > .hide-sm").should("be.visible");
		cy.get("[data-cy=header-starRating]").should("be.visible");
		cy.get("[data-cy=header-contactInfo]").should("be.visible");
		cy.get("[data-cy=stepperComponent]").should("be.visible");
		cy.get("[data-cy=stepperComponent]").should("be.visible");
		cy.get(":nth-child(1) > h3").should("be.visible");
		cy.get(".shipment-details-wrap > :nth-child(1) > h5").should("be.visible");
		cy.get(".bottom-shipment-details > h3").should("be.visible");
		cy.get(".input-wrapper").should("be.visible");
		cy.get(".item-image").should("be.visible");
		cy.get(".shipment-sevices").should("be.visible");
		cy.scrollTo("bottom");
		cy.get(".mycard").should("be.visible");
		cy.get(
			'[style="z-index: 3; position: absolute; height: 100%; width: 100%; padding: 0px; border-width: 0px; margin: 0px; left: 0px; top: 0px; touch-action: pan-x pan-y;"]'
		).should("be.visible");
		cy.get(".distance-display").should("be.visible");
		cy.get(".card-footer").should("be.visible");
		cy.get(".col-sm-12 > .btn-offerte").should("be.visible");
		cy.get(".dropdown-toggle").should("be.visible");
	});
});

/** ************************************************************
 **************** Mobile Responsiveness test********************
 ************************************************************ */

// Mobile has responsive issues - tests should resume once the issues are fixed
describe("Mobile - Responsiveness Test", () => {
	beforeEach(() => {
		cy.server();
		cy.viewport("samsung-s10");
	});

	it("pass login screens", () => {
		cy.visit("/");
	});
});
