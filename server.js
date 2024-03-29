const express = require('express');
const http = require('http');
const url = require('url');
const WebSocket = require('ws');
const path = require('path');

const NUM_ITEMS = 100;
const MESSAGES_PER_SECOND = 100;

const app = express();

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function callHandlerEveryN(handler, durationMs) {
  let pendingTimeout = null;

  (function helper() {
    const startTime = Date.now();
    handler();
    pendingTimeout = setTimeout(helper, Math.max(0, durationMs + startTime - Date.now()));
  }());

  return function destroy() {
    clearTimeout(pendingTimeout);
  };
}

const names = [
  'MARY',
  'PATRICIA',
  'LINDA',
  'BARBARA',
  'ELIZABETH',
  'JENNIFER',
  'MARIA',
  'SUSAN',
  'MARGARET',
  'DOROTHY',
  'LISA',
  'NANCY',
  'KAREN',
  'BETTY',
  'HELEN',
  'SANDRA',
  'DONNA',
  'CAROL',
  'RUTH',
  'SHARON',
  'MICHELLE',
  'LAURA',
  'SARAH',
  'KIMBERLY',
  'DEBORAH',
  'JESSICA',
  'SHIRLEY',
  'YASMINE',
  'CYNTHIA',
  'ANGELA',
  'MELISSA',
  'BRENDA',
  'AMY',
  'ANNA',
  'REBECCA',
  'VIRGINIA',
  'KATHLEEN',
  'PAMELA',
  'MARTHA',
  'DEBRA',
  'AMANDA',
  'PALOMA',
  'STEPHANIE',
  'CAROLYN',
  'CHRISTINE',
  'MARIE',
  'JANET',
  'CATHERINE',
  'FRANCES',
  'ANN',
  'JOYCE',
  'DIANE',
  'ALICE',
  'JULIE',
  'HEATHER',
  'TERESA',
  'DORIS',
  'GLORIA',
  'EVELYN',
  'JEAN',
  'CHERYL',
  'MILDRED',
  'JAMES',
  'JOHN',
  'ROBERT',
  'MICHAEL',
  'WILLIAM',
  'DAVID',
  'KILIAN',
  'RICHARD',
  'CHARLES',
  'JOSEPH',
  'THOMAS',
  'CHRISTOPHER',
  'DANIEL',
  'PAUL',
  'MARK',
  'GIOVANI',
  'DONALD',
  'GEORGE',
  'KENNETH',
  'STEVEN',
  'KANYE',
  'EDWARD',
  'BRIAN',
  'RONALD',
  'ANTHONY',
  'KEVIN',
  'JASON',
  'MATTHEW',
  'GARY',
  'TIMOTHY',
  'JOSE',
  'CAMERON',
  'LARRY',
  'JEFFREY',
  'FRANK',
  'ARNAUD',
  'SCOTT',
  'ERIC',
  'STEPHEN',
  'ANDREW',
  'RAYMOND',
  'GREGORY',
  'JOSHUA',
  'JERRY',
  'DENNIS',
  'WALTER',
  'PATRICK',
  'PETER',
  'HAROLD',
  'DOUGLAS',
  'HENRY',
  'BEN',
  'CARL',
  'ARTHUR',
  'RYAN',
  'ROGER',
  'JOE',
  'JUAN',
  'JACK',
  'ALBERT',
  'JONATHAN',
];
function createRandomName() {
  return `${names[Math.floor(Math.random() * names.length)]} ${
    names[Math.floor(Math.random() * names.length)]
  }`;
}

wss.on('connection', (ws) => {
  let destroy;

  ws.on('message', (message) => {
    if (message === 'init') {
      destroy = callHandlerEveryN(() => {
        if (ws.readyState === 1) {
          ws.send(
            JSON.stringify({
              id: Math.floor(Math.random() * NUM_ITEMS),
              value: Math.floor(Math.random() * NUM_ITEMS),
              name: createRandomName(),
            }),
          );
        }
      }, 1000 / MESSAGES_PER_SECOND);
    }
  });

  ws.on('close', () => {
    if (destroy) {
      destroy();
      destroy = null;
    }
  });
});

server.listen(7770, () => {
  console.log('Listening on %d', server.address().port);
});
