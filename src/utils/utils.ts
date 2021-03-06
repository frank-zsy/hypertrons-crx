export function elementExists(obj: null | JQuery) {
  return obj !== null && obj.length > 0;
}

export function getMetaContent(index: any) {
  const ele = document.getElementsByTagName('meta')[index];
  if (ele && ele.content) {
    return ele.content;
  }
  return null;
}

export function isNull(object: any) {
  if (
    object === null ||
    typeof object === 'undefined' ||
    object === '' ||
    JSON.stringify(object) === '[]' ||
    JSON.stringify(object) === '{}'
  ) {
    return true;
  }
  return false;
}

export async function chromeSet(key: string, value: any) {
  const items: { [key: string]: any; } = {};
  items[key] = value;
  return new Promise<void>((resolve, reject) => {
    chrome.storage.local.set(items, () => {
      resolve();
    })
  });
}

export async function chromeGet(key: string) {
  return new Promise<{ [key: string]: any; }>((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      resolve(result[key]);
    })
  });
}

export function getMessageI18n(key: string) {
  return chrome.i18n.getMessage(key);
}

export const isPerceptor = (): boolean => window.location.search.includes('perceptor');

export const minMaxRange = (data: Map<string, number>, MIN: number, MAX: number) => {
  const min = Math.min(...data.values());
  const max = Math.max(...data.values());
  for (let key of data.keys()) {
    data.set(key, ((data.get(key)! - min) / (1.0 * (max - min))) * (MAX - MIN) + MIN);
  }
  return data;
}

export const compareVersion = (version_1: string, version_2: string) => {
  const v1 = version_1.split('.');
  const v2 = version_2.split('.');
  const len = Math.max(v1.length, v2.length);

  while (v1.length < len) {
    v1.push('0');
  }
  while (v2.length < len) {
    v2.push('0');
  }

  for (let i = 0; i < len; i++) {
    const num_1 = parseInt(v1[i]);
    const num_2 = parseInt(v2[i]);

    if (num_1 > num_2) {
      return 1;
    }
    else if (num_1 < num_2) {
      return -1;
    }
  }

  return 0;
}

export const getBrowserType = () => {
  var userAgent = navigator.userAgent;
  var isOpera = userAgent.indexOf("Opera") > -1;
  var isEdge = userAgent.indexOf("Edge") > -1;
  var isFF = userAgent.indexOf("Firefox") > -1;
  var isSafari = userAgent.indexOf("Safari") > -1
    && userAgent.indexOf("Chrome") === -1;
  var isChrome = userAgent.indexOf("Chrome") > -1
    && userAgent.indexOf("Safari") > -1;

  if (isOpera) {
    return "Opera";
  }
  else if (isEdge) {
    return "Edge";
  }
  else if (isFF) {
    return "FireFox";
  }
  else if (isSafari) {
    return "Safari";
  }
  else if (isChrome) {
    return "Chrome";
  }
  else {
    return "Unknown";
  }

}

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function runsWhen(rules: any[]) {
  return (constructor: Function) => {
    constructor.prototype.include = rules;
  };
}

export enum GraphType {
  antv = "antv", echarts = "echarts"
}

export function generateGraphDataMap(rawData: any) {
  const nodeMap = new Map<string, number>();
  const nodeMap2Range = new Map<string, number>();
  const edgeMap = new Map<string, number>();
  const edgeMap2Range = new Map<string, number>();

  rawData.nodes.forEach((node: any) => {
    nodeMap.set(node.name, node.value);
    nodeMap2Range.set(node.name, node.value);
  });
  rawData.edges.forEach((edge: any) => {
    edgeMap.set(`${edge.source} ${edge.target}`, edge.weight);
    edgeMap2Range.set(`${edge.source} ${edge.target}`, edge.weight);
  });

  minMaxRange(nodeMap2Range, 10, 50);
  minMaxRange(edgeMap2Range, 1, 10);

  return {
    nodeMap,
    edgeMap,
    nodeMap2Range,
    edgeMap2Range,
  }
}