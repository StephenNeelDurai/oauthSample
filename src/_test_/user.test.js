
const request = require('supertest');
const app = require('../../app');

describe("Testing User API", () => {

	it("Fetching user data with accessToken expect success", async () => {
		const response = await request(app).get('/user?accessToken=xyz');
		expect(response.status).toBe(200);
		expect(response.body.status).toBe(true);

	});
	it("Fetching user data without accessToken expect failure", async () => {
		const response = await request(app).get('/user');
		expect(response.status).toBe(400);
	});
	it("Updating user name with accessToken expect success", async () => {
		const response = await request(app).post('/user').send({ accessToken: 'xyz', user: { name: 'Neel' } });
		expect(response.status).toBe(200);
		expect(response.body.status).toBe(true);

	});
	it("Updating user name without accessToken expect failure", async (done) => {
		const response = await request(app).post('/user').send({ user: { name: 'Neel' } });
		expect(response.status).toBe(400);
		done();
	});

});