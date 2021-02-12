# bmc-createserver-github-action

This action creates a new server in the PhoenixNAP Bare Metal Cloud platform, and outputs the new server ID and comma separated list of its public IP addresses. The action is synchronous, however the server creation and boot process is asynchronous. Subsequent actions in your workflow (deployment phases for example) should probe for machine readiness.

## Required inputs

- `clientid`: 'Client ID from application OAuth2 credentials.
- `clientsecret`: Client Secret from application OAuth2 credentials.
- `hostname`: Hostname of server. 1 ≤ length ≤ 100 matches `^(?=.*[a-zA-Z])([a-zA-Z0-9().-])+$`

## Optional inputs

- `image`: The server’s OS ID. Defaults to `ubuntu/bionic`.
- `type`: Server type ID. Defaults to `s1.c1.small`.
- `location`: Server Location ID. Cannot be changed once a server is created. Currently this field should be set to PHX or ASH. Defaults to `PHX`.
- `bmcentrypoint` The BMC API entrypoint. Defaults to `https://api.phoenixnap.com/bmc/v1/`.
- `bmctokenhost`: The BMC OIDC token host. Defaults to `https://auth.phoenixnap.com`.
- `bmctokenpath`: The BMC OIDC token path. Defaults to `/auth/realms/BMC/protocol/openid-connect/token`.

### Outputs

- `id`: The new BMC server ID.
- `ipaddresses`: A comma separated list of public IP address attached to the new server.

## Secrets the action uses

This action exercises a PhoenixNAP BMC API and requires valid client credentials. Follow steps 1 and 2 of the [PhoenixNAP developers quickstart guide](https://developers.phoenixnap.com/quick-start) to create a `client_id` and `client_secret`. You should store those credentials as GitHub Secrets and use them in the `clientid` and `clientsecret` required inputs. See the following example.

## An example of how to use your action in a workflow

```yaml
- name: CreateServer step
  uses: phoenixnap/bmc-createserver-github-action 
  id: createserver
  with:
    clientid: ${{secrets.BMC_CLIENT_ID}}
    clientsecret: ${{secrets.BMC_CLIENT_SECRET}}
    hostname: "ghatest1"
    sshkeyids: "Testing.local"
    image: "ubuntu/bionic"
    location: "PHX"
    type: "s1.c1.small"
    description: "This server created using GitHub Actions."
```
