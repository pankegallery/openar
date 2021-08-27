import { create, globSource } from "ipfs-http-client";

// connect to a different API
const ipfs = create({
  // url: "http://127.0.0.1:5001",
  url: "/ip4/0.0.0.0/tcp/5001",
});

const run = async () => {
  // call Core API methods

  console.log(ipfs.getEndpointConfig());

  try {

    const file = await ipfs.add(
      globSource(
        "/Users/fluxed/Dropbox/www/fluxed/openar/openar-monorepo/data/uploadtests/o1/",
        { recursive: true }
      )
    );

    console.log(file.cid.toString());

    // const files = await ipfs.files.read(`/${file.path}`);

    // console.log(files.cid);
    // files.forEach((file) => {
    //   console.log(file.path);
    //   //console.log(file.content.toString('utf8'))
    // });
  } catch (err) {
    console.log(err);
  }
};

run();
