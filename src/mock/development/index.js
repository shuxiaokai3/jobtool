import MockAdapter from "./mock-adapter";
import mockData from "./mock-data/data";

// console.log("mockData", mockData);

//=====================================mock数据拦截====================================//

export default function mock(axios) {
    const mock = new MockAdapter(axios, {
        delayResponse: 500
    });
    // mock.onGet("/mock/data").reply(200, mockData.a.a1);
    mock.onGet("/test/time").reply(200, mockData.time);
    mock.onGet("/test/link").reply(200, mockData.link);
    mock.onGet("/test/category").reply(200, mockData.category);
   

    mock.onAny().passThrough();
}
