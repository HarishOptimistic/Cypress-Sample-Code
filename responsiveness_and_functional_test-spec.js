/* eslint-disable no-undef */
describe("Vehicles Department Login and Step 1", () => {
	beforeEach(() => {
		cy.server();
		cy.viewport("macbook-11");
	});

	it("Test Login Screens", () => {
		cy.passLoginScreens();
	});

	it("Switch to Vehicles Department", () => {
		cy.get(".dropdown-toggle")
			.should("be.visible")
			.click();
		cy.get(".dropdown-menu > :nth-child(1)")
			.should("be.visible")
			.contains("couriers");
		cy.get(".dropdown-menu > :nth-child(2)")
			.should("be.visible")
			.contains("vehicles")
			.click();
	});

	it("Verify and select options in the modal", () => {
		cy.server();
		cy.route("GET", "/services/prices").as("prices");
		cy.route("GET", "/vehicle-information-service/brands").as("brands");
		cy.route("GET", "/vehicle-information-service/brands/*/models").as(
			"models"
		);

		cy.wait("@prices");
		cy.get("@prices").then(xhr => {
			expect(xhr.method).to.eq("GET");
			expect(xhr.status).to.eq(200);
			expect(xhr.requestHeaders).to.have.property("X-Department", `vehicles`);
			expect(xhr.response.body).to.have.property("data");
			expect(xhr.response.body).to.have.property("meta");
		});

		cy.wait("@brands");
		cy.get("@brands").then(xhr => {
			expect(xhr.method).to.eq("GET");
			expect(xhr.status).to.eq(200);
			expect(xhr.requestHeaders).to.have.property("X-Department", `vehicles`);
		});

		cy.get(".modal-body").should("be.visible");
		cy.get(".vehicleNumberStyle").should("be.visible");
		cy.get(".orText > .mb-0").should("be.visible");
		cy.get(".text-center").should("be.visible");
		cy.get(".btnDisabled").should("be.visible");

		cy.wait(1000);
		cy.get("#selectMake").selectNth(1);

		cy.wait("@models");
		cy.get("@models").then(xhr => {
			expect(xhr.method).to.eq("GET");
			expect(xhr.status).to.eq(200);
			expect(xhr.requestHeaders).to.have.property("X-Department", `vehicles`);
		});

		cy.route("GET", "/vehicle-information-service/construction-years?*").as(
			"construction-years"
		);
		cy.route("GET", "/vehicle-information-service/fuels?*").as("fuels");

		cy.get("#selectModel").selectNth(1);

		cy.wait("@construction-years");
		cy.get("@construction-years").then(xhr => {
			expect(xhr.url).to.match(/\?model_id=/);
			expect(xhr.method).to.eq("GET");
			expect(xhr.status).to.eq(200);
			expect(xhr.requestHeaders).to.have.property("X-Department", `vehicles`);
			// Should find a solution to check just the length without specying a value
			expect(xhr.response.body).to.have.length(1);
		});

		cy.wait("@fuels");
		cy.get("@fuels").then(xhr => {
			expect(xhr.url).to.match(/\?model_id=/);
			expect(xhr.url).to.match(/&brand_id/);
			expect(xhr.method).to.eq("GET");
			expect(xhr.status).to.eq(200);
			expect(xhr.requestHeaders).to.have.property("X-Department", `vehicles`);
			// Should find a solution to check just the length without specying a value
			expect(xhr.response.body).to.have.length(1);
		});

		cy.get("#selectYear").selectNth(1);

		cy.wait(1000);
		cy.get("#selectFuel").selectNth(1);

		cy.route("POST", "/booking-service/order-synchronization").as(
			"order-synchronization"
		);
		cy.route("GET", "/vehicle-information-service/information?*").as(
			"vehicle-info"
		);
		cy.route("GET", "/services/**").as("price-info");

		cy.get(".selectButton")
			.should("be.visible")
			.click();

		cy.server();
		cy.route("POST", "/booking-service/order-synchronization").as(
			"order-synchronization"
		);
		cy.wait("@order-synchronization");
		cy.get("@order-synchronization").then(xhr => {
			expect(xhr.method).to.eq("POST");
			expect(xhr.status).to.eq(200);
			expect(xhr.requestHeaders).to.have.property("X-Department", `vehicles`);
			expect(xhr.response.body).to.have.property("code");
			expect(xhr.response.body).to.have.property("created_at");
			expect(xhr.response.body)
				.to.have.property("data")
				.to.have.all.keys("plate_id", "vehicle_id");
			expect(xhr.response.body).to.have.property(
				"support_code_issue_timestamp"
			);
			expect(xhr.response.body).to.have.property("updated_at");
		});

		cy.wait("@vehicle-info");
		cy.get("@vehicle-info").then(xhr => {
			expect(xhr.method).to.eq("GET");
			expect(xhr.url).to.match(/\?brand_id=/);
			expect(xhr.url).to.match(/&fuel_id=/);
			expect(xhr.url).to.match(/&construction_year=/);
			expect(xhr.status).to.eq(200);
			expect(xhr.requestHeaders).to.have.property("X-Department", `vehicles`);
			expect(xhr.response.body)
				.to.have.property("brand")
				.to.have.all.keys("created_at", "id", "name", "updated_at");
			expect(xhr.response.body).to.have.property("construction_year");
			expect(xhr.response.body)
				.to.have.property("fuel")
				.to.have.all.keys("created_at", "id", "name", "updated_at");
			expect(xhr.response.body).to.have.property("images");
			expect(xhr.response.body)
				.to.have.property("model")
				.to.have.all.keys("brand_id", "id", "name");
			expect(xhr.response.body).to.have.property("vehicle_id");
		});

		cy.wait("@price-info");
		cy.get("@price-info").then(xhr => {
			expect(xhr.method).to.eq("GET");
			expect(xhr.status).to.eq(200);
			expect(xhr.requestHeaders).to.have.property("X-Department", `vehicles`);
		});
	});

	it("confirm vehicle modal", () => {
		cy.route("GET", "/services/prices?*").as("price-info");
		cy.route("POST", "/booking-service/order-synchronization").as(
			"order-synchronization"
		);

		cy.get(".modal-body").should("be.visible");
		cy.get("h5").should("be.visible");
		cy.get(".imageClass").should("be.visible");
		cy.get(".questionStyle").should("be.visible");
		cy.get(".selectButton").should("be.visible");
		cy.get(".btnYes")
			.should("be.visible")
			.click();

		cy.wait("@price-info");
		cy.get("@price-info").then(xhr => {
			expect(xhr.method).to.eq("GET");
			expect(xhr.url).to.match(/\?data=/);
			expect(xhr.status).to.eq(200);
			expect(xhr.requestHeaders).to.have.property("X-Department", `vehicles`);
			expect(xhr.response.body).to.have.property("data");
			expect(xhr.response.body).to.have.property("meta");
		});

		cy.wait("@order-synchronization");
		cy.get("@order-synchronization").then(xhr => {
			expect(xhr.method).to.eq("POST");
			expect(xhr.status).to.eq(200);
			expect(xhr.requestHeaders).to.have.property("X-Department", `vehicles`);
			expect(xhr.response.body).to.have.property("code");
			expect(xhr.response.body).to.have.property("created_at");
			expect(xhr.response.body).to.have.property("data");
			expect(xhr.response.body).to.have.property(
				"support_code_issue_timestamp"
			);
			expect(xhr.response.body).to.have.property("updated_at");
		});
	});

	it("verify Vehicle department main screen", () => {
		cy.get(".header").should("be.visible");
		cy.get(".logo").should("be.visible");
		cy.get(".mid-col").should("be.visible");
		cy.get(".justify-content-end").should("be.visible");

		cy.get(".stepper");

		cy.get(":nth-child(1) > #btn-popover").should("be.visible");
		cy.get(":nth-child(1) > .stepper-title").should("be.visible");
		cy.get(":nth-child(1) > .stepper-description").should("be.visible");

		cy.get(":nth-child(2) > #btn-popover").should("be.visible");
		cy.get(":nth-child(2) > .stepper-title").should("be.visible");
		cy.get(":nth-child(2) > .stepper-description").should("be.visible");

		cy.get(":nth-child(3) > #btn-popover").should("be.visible");
		cy.get(":nth-child(3) > .stepper-title").should("be.visible");
		cy.get(":nth-child(3) > .stepper-description").should("be.visible");

		cy.get(":nth-child(1) > .active");
		cy.get(":nth-child(2) > .nav-link");
		cy.get(":nth-child(3) > .nav-link");
		cy.get(":nth-child(4) > .nav-link");

		cy.scrollTo(0, 500);
		cy.get(".active > .card").should("be.visible");
		cy.get(".active > .card > :nth-child(1)").should("be.visible");

		cy.scrollTo(0, 850);
		cy.get(".card-wrapper").should("be.visible");
		cy.get(".card-img-top").should("be.visible");
		cy.get(".vehicleNumberStyle").should("be.visible");
		cy.get(".alertStyle > span").should("be.visible");
		cy.get(".calc-item > p").should("be.visible");
		cy.get(".col-md-5 > p").should("be.visible");
		cy.get(".col-md-7 > p").should("be.visible");
		cy.get(":nth-child(4) > .btn-offerte").should("be.visible");

		cy.scrollTo("bottom");
		cy.get(".listItem > ul > :nth-child(1)").should("be.visible");
		cy.get(".listItem > ul > :nth-child(2)").should("be.visible");
		cy.get(".listItem > ul > :nth-child(3)").should("be.visible");
		cy.get(".listItem > ul > :nth-child(4)").should("be.visible");

		cy.get(".col-sm-12 > .btn-offerte")
			.should("be.visible")
			.click();

		cy.vehiclesPhoneModal();

		cy.get(":nth-child(4) > .btn-offerte")
			.should("be.visible")
			.click();

		cy.vehiclesPhoneModal();
	});

	it("Check a service", () => {
		cy.server();
		cy.route("GET", "/services/**").as("services");

		cy.scrollTo("top");
		cy.get(
			'.haveWarning > [style="display: flex; align-content: center;"] > .checkmark > .checkmark-inner'
		)
			.should("be.visible")
			.click();

		cy.wait("@services");

		cy.get("@services").then(xhr => {
			expect(xhr.method).to.eq("GET");
			expect(xhr.status).to.eq(200);
			expect(xhr.requestHeaders).to.have.property("Accept", "application/json");
			expect(xhr.requestHeaders).to.have.property("X-Department", `vehicles`);
			expect(xhr.response.body).to.have.property("data");
			expect(xhr.response.body).to.have.property("meta");
		});
	});

	it("Verify Cart and checkout", () => {
		cy.get(".fakeprice").should("be.visible");
		cy.get("#btn-popover > .btn-sr-yellow")
			.should("be.visible")
			.click();
	});
});

/** ************************************************************
 **************** IPad responsiveness test *********************
 ************************************************************ */

describe("ipad - Responsiveness Test - vehicles Department Login and Step 1", () => {
	beforeEach(() => {
		cy.server();
		cy.viewport(1024, 1366);
	});

	it("pass login screens", () => {
		cy.ipadResponsivenessForLoginScreens();
	});

	it("switch to vehicles department", () => {
		cy.get(".dropdown-toggle")
			.should("be.visible")
			.click();
		cy.get(".dropdown-menu > :nth-child(1)")
			.should("be.visible")
			.contains("couriers");
		cy.get(".dropdown-menu > :nth-child(2)")
			.should("be.visible")
			.contains("vehicles")
			.click();
	});

	it("modal 1", () => {
		cy.get(".modal");
		cy.get(".modal-content > :nth-child(1)");
		cy.wait(1000);
		cy.get("#selectMake").selectNth(1);
		cy.wait(1000);
		cy.get("#selectModel").selectNth(1);
		cy.wait(1000);
		cy.get("#selectYear").selectNth(1);
		cy.wait(1000);
		cy.get("#selectFuel").selectNth(1);
		cy.get(".selectButton")
			.should("be.visible")
			.click();
		cy.wait(3000);
	});

	it("modal 2", () => {
		cy.get(".modal-content > :nth-child(1)").should("be.visible");
		cy.get(".itemDetail > h5").should("be.visible");
		cy.get(".imageClass").should("be.visible");
		cy.get(".questionStyle").should("be.visible");
		cy.get(".selectButton").should("be.visible");
		cy.get(".btnYes")
			.should("be.visible")
			.click();
	});

	it("step 1 - vehicles", () => {
		cy.get("[data-cy=header]").should("be.visible");
		cy.get("[data-cy=header-logo]").should("be.visible");
		cy.get("[data-cy=header-starRating]").should("be.visible");
		cy.get("[data-cy=header-contactInfo]").should("be.visible");
		cy.get("[data-cy=stepperComponent]").should("be.visible");
		cy.get(".items-selector > .mycard").should("be.visible");
		cy.get(".active > .card").should("be.visible");
		cy.get(".see-all-row > .btn").should("be.visible");
		cy.get(
			'.haveWarning > [style="display: flex; align-content: center;"] > .checkmark'
		)
			.should("be.visible")
			.click();
		cy.get(".col-md-3").should("be.visible");
		cy.get(":nth-child(5) > .btn-offerte").should("be.visible");
		cy.get("#btn-popover > .btn-sr-yellow").should("be.visible");
		cy.get(".col-sm-12 > .btn-offerte").should("be.visible");
		cy.scrollTo("bottom");
		cy.get("#btn-popover > .btn-sr-yellow")
			.should("be.visible")
			.click();
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
