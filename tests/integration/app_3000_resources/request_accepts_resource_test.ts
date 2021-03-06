import members from "../../members.ts";

members.testSuite("Accept header (Test suite 1)", () => {
  members.test("request accepts one and multiple types", async () => {
    let response;
    let json;
    let typeToCheck;

    // Accepts the correct type the resource will give - tests calling the `accepts` method with a string and finds a match
    typeToCheck = "application/json";
    response = await members.fetch.get(
      "http://localhost:3000/request-accepts?typeToCheck=" + typeToCheck,
      {
        headers: {
          Accept: "application/json",
        },
      },
    );
    json = JSON.parse(await response.json());
    members.assertEquals(json.success, true);
    members.assertEquals(json.message, "application/json");

    // Does not accept the type the resource expects - tests calling the `accepts` method with a string with no match
    response = await members.fetch.get(
      "http://localhost:3000/request-accepts?typeToCheck=" + typeToCheck,
      {
        headers: {
          Accept: "text/html",
        },
      },
    );
    json = JSON.parse(await response.json());
    await members.assertEquals(json.success, false);
    members.assertEquals(json.message, undefined);

    // Accepts the first content type - tests when calling the `accepts` method with an array and finds a match
    response = await members.fetch.get(
      "http://localhost:3000/request-accepts",
      {
        headers: {
          Accept: "text/xml,text/html,application/json;0.5;something",
        },
      },
    );
    json = JSON.parse(await response.json());
    members.assertEquals(json.success, true);
    members.assertEquals(json.message, "text/html");

    // Accepts the first content type - tests when calling the `accepts` method with an array with no match
    response = await members.fetch.get(
      "http://localhost:3000/request-accepts",
      {
        headers: {
          Accept: "text/js,text/php,text/python;0.5;something", // random stuff the resource isn't looking for
        },
      },
    );
    json = JSON.parse(await response.json());
    members.assertEquals(json.success, false);
    members.assertEquals(json.message, undefined);
  });
});
