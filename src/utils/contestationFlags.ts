const SESSION_SET = new Set<string>();

const SESSION_CONFIRM_SET = new Set<string>();

/**
 * Marca que o usuário iniciou contestação para uma análise (sessão + persistência com TTL).
 * @param farmId
 * @param analysisId
 * @param ttlMs default 10 dias
 */
export function setContestationClicked(
  farmId: number,
  analysisId: number,
  ttlMs = 10 * 24 * 60 * 60 * 1000
) {
  const key = `contestationClicked:${farmId}:${analysisId}`;
  try {
    const payload = { value: true, expiry: Date.now() + ttlMs };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {}
  SESSION_SET.add(`${farmId}:${analysisId}`);
}

export function hasContestationClicked(farmId: number, analysisId: number) {
  const sessionKey = `${farmId}:${analysisId}`;
  if (SESSION_SET.has(sessionKey)) return true;

  const key = `contestationClicked:${farmId}:${analysisId}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (parsed?.expiry && Date.now() > parsed.expiry) {
      localStorage.removeItem(key);
      return false;
    }
    return !!parsed?.value;
  } catch {
    return false;
  }
}

export function clearContestationClicked(farmId: number, analysisId: number) {
  const sessionKey = `${farmId}:${analysisId}`;
  SESSION_SET.delete(sessionKey);
  try {
    localStorage.removeItem(`contestationClicked:${farmId}:${analysisId}`);
  } catch {}
}


export function setConfirmedClicked(
  farmId: number,
  analysisId: number,
  ttlMs = 10 * 24 * 60 * 60 * 1000
) {
  const key = `confirmedClicked:${farmId}:${analysisId}`;
  try {
    const payload = { value: true, expiry: Date.now() + ttlMs };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {}
  SESSION_CONFIRM_SET.add(`${farmId}:${analysisId}`);
}

export function hasConfirmedClicked(farmId: number, analysisId: number) {
  const sessionKey = `${farmId}:${analysisId}`;
  if (SESSION_CONFIRM_SET.has(sessionKey)) return true;

  const key = `confirmedClicked:${farmId}:${analysisId}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    if (parsed?.expiry && Date.now() > parsed.expiry) {
      localStorage.removeItem(key);
      return false;
    }
    return !!parsed?.value;
  } catch {
    return false;
  }
}

export function clearConfirmedClicked(farmId: number, analysisId: number) {
  const sessionKey = `${farmId}:${analysisId}`;
  SESSION_CONFIRM_SET.delete(sessionKey);
  try {
    localStorage.removeItem(`confirmedClicked:${farmId}:${analysisId}`);
  } catch {}
}

const contestationFlags = {
  setContestationClicked,
  hasContestationClicked,
  clearContestationClicked,
};

export default contestationFlags;
