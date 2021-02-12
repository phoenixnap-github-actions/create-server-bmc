const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');
const { ClientCredentials } = require('simple-oauth2');

async function run() {
  const clientID     = core.getInput('clientid');
  const clientSecret = core.getInput('clientsecret');

  if (!clientID || 0 === clientID.length) {
    return core.setFailed(`Required input "clientid" is unset.`);
  }
  if (!clientSecret || 0 === clientSecret.length) {
    return core.setFailed(`Required input "clientsecret" is unset.`)
  }

  const hostname    = core.getInput('hostname');
  const image       = core.getInput('image');
  const locationID  = core.getInput('location');
  const typeID      = core.getInput('type');
  const description = core.getInput('description');

  if (!hostname || 0 === hostname.length) {
    return core.setFailed(`Required input "hostname" is unset.`)
  }
  if (!image || 0 === image.length) {
    return core.setFailed(`Required input "image" is unset.`)
  }
  if (!locationID || 0 === locationID.length) {
    return core.setFailed(`Required input "location" is unset.`)
  }
  if (!typeID || 0 === typeID.length) {
    return core.setFailed(`Required input "type" is unset.`)
  }
  if (!description || 0 === description.length) {
    return core.setFailed(`Required input "description" is unset.`)
  }

  const bmcEntrypoint = core.getInput('bmcentrypoint');
  const bmcTokenHost  = core.getInput('bmctokenhost');
  const bmcTokenPath  = core.getInput('bmctokenpath');

  if (!bmcEntrypoint || 0 === bmcEntrypoint.length) {
    return core.setFailed(`Required input "bmcentrypoint" is unset.`)
  }
  if (!bmcTokenHost || 0 === bmcTokenHost.length) {
    return core.setFailed(`Required input "bmctokenhost" is unset.`)
  }
  if (!bmcTokenPath || 0 === bmcTokenPath.length) {
    return core.setFailed(`Required input "bmctokenpath" is unset.`)
  }

  try {
    const client = new ClientCredentials({
      client: { id: clientID, secret: clientSecret },
      auth: { tokenHost: bmcTokenHost, tokenPath: bmcTokenPath },
      options: { bodyFormat: "form" }
    });
    const accessToken = await client.getToken();

    const response = await axios({
      method: 'post',
      baseURL: bmcEntrypoint,
      url: '/servers',
      headers: { 
        'Authorization': `Bearer ${accessToken.token.access_token}`,
        'Content-Type': 'application/json'
      },
      data: {
        hostname: hostname,
        description: description,
        os: image,
        type: typeID,
        location: locationID,
      }
    });

    core.setOutput('id', response.data.id);
    core.setOutput('ipaddresses', response.data.publicIpAddresses.join(','))
  } catch (error) {
    console.log(error.response.data.validationErrors);
    core.setFailed(error.message);
  }
}

run();
