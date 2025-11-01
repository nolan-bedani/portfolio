"use client";

import { useEffect, useMemo, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Repeat,
  ChevronRight,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trophy,
} from "lucide-react";

/* ====== Logos (depuis /icons à la racine) ====== */
import kubernetesLogo from "../../icons/kubernetes.png";
import grafanaLogo from "../../icons/grafana.png";
import prometheusLogo from "../../icons/prometheus.png";
import gitlabLogo from "../../icons/gitlab.svg";
import awsLogo from "../../icons/aws.png";
import nginxLogo from "../../icons/nginx.svg";
import buildingLogo from "../../icons/bulding.svg";

/* =========================================================
   Données types
========================================================= */
type Result = "ok" | "warn" | "fail";

type Action = {
  id: string;
  label: string;
  result: Result;
  output: string;
  next?: number; // index de la prochaine étape ; si undefined => fin
};

type Step = {
  title: string;
  prompt: string;
  actions: Action[];
};

type Scenario = {
  key: string;
  title: string;
  subtitle: string;
  icons: (StaticImageData | string)[];
  steps: Step[];
  successMessage: string;
};

/* =========================================================
   Scénarios (4)
========================================================= */
const RUNBOOKS: Scenario[] = [
  // 1) K8s latence
  {
    key: "k8s-latency",
    title: "Kubernetes — Latence élevée (p95)",
    subtitle: "SLO en alerte, diagnostiquer et stabiliser",
    icons: [kubernetesLogo, grafanaLogo, prometheusLogo],
    successMessage:
      "SLO stabilisé : p95 < 250ms. HPA ajusté, limites CPU/mémoire relevées, rollout OK.",
    steps: [
      {
        title: "Observer",
        prompt:
          "Le dashboard SLO signale une latence p95 en hausse. Première action ?",
        actions: [
          {
            id: "grafana",
            label: "Ouvrir Grafana (latence p95, erreurs 5xx)",
            result: "ok",
            output:
              "Grafana → p95 up depuis 15 min, pic 480ms. 5xx stables. Erreurs timeouts côté service web.",
            next: 1,
          },
          {
            id: "restart",
            label: "Redémarrer les pods directement",
            result: "warn",
            output:
              "kubectl rollout restart → pods redémarrés. Latence inchangée. Risque d’empirer si cause non traitée.",
            next: 0,
          },
          {
            id: "ignore",
            label: "Ignorer (latence ponctuelle ?)",
            result: "fail",
            output:
              "Le SLO continue à se dégrader. L’alerte passe en priorité élevée. Action requise.",
            next: 0,
          },
        ],
      },
      {
        title: "Diagnostiquer",
        prompt:
          "Les erreurs 5xx ne montent pas. Suspect : saturation des ressources.",
        actions: [
          {
            id: "kubectl-top",
            label: "kubectl top pods (CPU/Memory Throttle)",
            result: "ok",
            output:
              "kubectl top pods → 2 pods throttling CPU, mémoire proche des limites, QPS en hausse.",
            next: 2,
          },
          {
            id: "svc",
            label: "kubectl describe svc (routing/timeout)",
            result: "warn",
            output:
              "Service et endpoints OK, pas d’anomalie flagrante. Piste ressources toujours plausible.",
            next: 1,
          },
          {
            id: "autoscale-aveugle",
            label: "Augmenter replicas à l’aveugle (HPA min=6)",
            result: "warn",
            output:
              "Réplicas ↑ 6. Latence baisse un peu mais p95 reste > 300ms. Risque coût ↑ si limites trop serrées.",
            next: 2,
          },
        ],
      },
      {
        title: "Agir",
        prompt:
          "Hypothèse confirmée : throttling CPU et limites serrées. Que fais-tu ?",
        actions: [
          {
            id: "limits+hpa",
            label:
              "Relever requests/limits + HPA (min/max) et déployer (rollout)",
            result: "ok",
            output:
              "Helm upgrade → limits + HPA ajustés. Rollout OK. p95 ⇩ à 230ms en 3 min.",
            next: undefined,
          },
          {
            id: "cache",
            label: "Purger le cache applicatif",
            result: "warn",
            output:
              "Purge → légère baisse p95 mais instable. Root cause non traitée (ressources).",
            next: 2,
          },
          {
            id: "network",
            label: "Modifier timeouts réseau côté Ingress",
            result: "warn",
            output:
              "Timeouts ↑ côté Ingress → masque partiellement le symptôme, pas la cause. Préfère agir sur ressources.",
            next: 2,
          },
        ],
      },
    ],
  },

  // 2) CI/CD
  {
    key: "cicd-red",
    title: "CI/CD — Pipeline GitLab en échec",
    subtitle: "Identifier la cause et rétablir le vert",
    icons: [gitlabLogo],
    successMessage:
      "Pipeline vert : variables corrigées, tests OK, déploiement effectué.",
    steps: [
      {
        title: "Lire",
        prompt:
          "Le pipeline est en rouge sur l’étape 'tests'. Première action ?",
        actions: [
          {
            id: "open-logs",
            label: "Ouvrir les logs de job (JUnit summary)",
            result: "ok",
            output:
              "Logs → 8 tests échouent. Erreur 'DATABASE_URL non défini'. Step précédente : 'prepare env'.",
            next: 1,
          },
          {
            id: "rerun",
            label: "Relancer le pipeline",
            result: "warn",
            output:
              "Rerun → même échec. Symptôme persistant. Il faut corriger la variable.",
            next: 0,
          },
        ],
      },
      {
        title: "Corriger",
        prompt:
          "La variable d’environnement est manquante. Que fais-tu ?",
        actions: [
          {
            id: "set-var",
            label:
              "Définir DATABASE_URL dans GitLab (protected, masked) + relancer",
            result: "ok",
            output:
              "DATABASE_URL défini (masked). Rerun → tests OK, build OK, déploiement OK.",
            next: undefined,
          },
          {
            id: "hardcode",
            label: "Coder en dur la variable dans le repo",
            result: "fail",
            output:
              "Mauvaise pratique (secret dans le code). MR refusée par la policy.",
            next: 1,
          },
          {
            id: "skip-tests",
            label: "Désactiver temporairement les tests",
            result: "warn",
            output:
              "Tests skip → pipeline passe mais qualité dégradée. Non acceptable en prod.",
            next: 1,
          },
        ],
      },
    ],
  },

  // 3) Réseau — Boucle STP
  {
    key: "stp-loop",
    title: "Réseau — Boucle STP détectée",
    subtitle: "CPU switch ↑, ports flappent, storm broadcast",
    icons: [nginxLogo, grafanaLogo, buildingLogo],
    successMessage:
      "Boucle éliminée : port isolé, BPDU Guard activé sur ports d’accès, UDLD configuré.",
    steps: [
      {
        title: "Observer",
        prompt:
          "Alertes : CPU switch ↑, flapping MAC, tempête de broadcast. Première action ?",
        actions: [
          {
            id: "show-stp",
            label: "show spanning-tree detail / root",
            result: "ok",
            output:
              "STP → Root bridge OK. Plusieurs TCN récents. Un port access reçoit des BPDUs.",
            next: 1,
          },
          {
            id: "show-logs",
            label: "show logging (dernier 5 min)",
            result: "warn",
            output:
              "Logs montrent des transitions STP fréquentes. Besoin d’identifier le port fautif.",
            next: 0,
          },
          {
            id: "sh-mac",
            label: "show mac address-table | count",
            result: "warn",
            output:
              "MAC table très instable. Indice d’une boucle mais pas l’origine exacte.",
            next: 0,
          },
        ],
      },
      {
        title: "Diagnostiquer",
        prompt:
          "Un port access reçoit des BPDUs : piste d’un switch non géré/loop. Prochaine étape ?",
        actions: [
          {
            id: "bpduguard",
            label: "Activer BPDU Guard sur ports access",
            result: "ok",
            output:
              "BPDU Guard activé. Le port suspect passe en err-disable à la réception d’un BPDU.",
            next: 2,
          },
          {
            id: "udld",
            label: "Vérifier UDLD & loopback-detection",
            result: "warn",
            output:
              "UDLD pas actif partout. Utile mais ne stoppe pas la boucle actuelle.",
            next: 1,
          },
          {
            id: "shut-no-shut",
            label: "shutdown/no shutdown du port uplink",
            result: "warn",
            output:
              "Temporaire. Peut restaurer, mais la source de la boucle access reste.",
            next: 1,
          },
        ],
      },
      {
        title: "Agir",
        prompt:
          "Le port fautif a été err-désactivé. Quelle mesure durable mets-tu en place ?",
        actions: [
          {
            id: "policy",
            label:
              "Généraliser BPDU Guard + PortFast sur access & UDLD normal sur uplinks",
            result: "ok",
            output:
              "Configuration appliquée. Boucle éliminée et prévention en place.",
            next: undefined,
          },
          {
            id: "ignore",
            label: "Réactiver le port et espérer le mieux",
            result: "fail",
            output:
              "Mauvaise pratique : la boucle peut revenir. Politique à mettre en place.",
            next: 2,
          },
        ],
      },
    ],
  },

  // 4) Cloud — Coût AWS
  {
    key: "aws-cost",
    title: "Cloud — Facture AWS en hausse",
    subtitle: "Coût soudain ↑, identifier la cause",
    icons: [awsLogo, grafanaLogo],
    successMessage:
      "Dérive maîtrisée : règles S3 Lifecycle, budgets/alertes, sampling logs ajusté.",
    steps: [
      {
        title: "Observer",
        prompt:
          "Budget alerte : coût ↑ 60% cette semaine. Première action ?",
        actions: [
          {
            id: "ce",
            label: "Ouvrir Cost Explorer (service breakdown)",
            result: "ok",
            output:
              "Cost Explorer → S3 + CloudWatch Logs en forte hausse. Pics d’écritures.",
            next: 1,
          },
          {
            id: "ignore",
            label: "Reporter à la semaine prochaine",
            result: "fail",
            output:
              "La dérive continue. Risque de dépassement budget mensuel.",
            next: 0,
          },
        ],
      },
      {
        title: "Diagnostiquer",
        prompt:
          "S3/Logs en cause : volumétrie en explosion. Piste ?",
        actions: [
          {
            id: "logs",
            label: "Analyser métriques CloudWatch + volumes S3",
            result: "ok",
            output:
              "Découverte : logs debug activés en prod + rétention illimitée S3.",
            next: 2,
          },
          {
            id: "ec2",
            label: "Regarder EC2 (types/ASG)",
            result: "warn",
            output:
              "EC2 stable. L’anomalie vient des logs/stockage.",
            next: 1,
          },
        ],
      },
      {
        title: "Agir",
        prompt:
          "Comment corriger la dérive de coût ?",
        actions: [
          {
            id: "lifecycle",
            label: "Règles S3 Lifecycle + baisser log level + Budget alarm",
            result: "ok",
            output:
              "Lifecycle sur buckets, sampling ↓, budgets & SNS. Coût quotidien redevient normal.",
            next: undefined,
          },
          {
            id: "delete",
            label: "Supprimer tous les logs (risqué)",
            result: "warn",
            output:
              "Risqué pour la traçabilité/audit. Préfère lifecycle & sampling.",
            next: 2,
          },
        ],
      },
    ],
  },
];

/* =========================================================
   Util : effet de saisie (typing) pour le terminal
========================================================= */
function useTypewriter(text: string, speed = 12) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let i = 0;
    const id = setInterval(() => {
      i++;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return out;
}

/* =========================================================
   Gamification : score + badge
========================================================= */
function scoreDelta(res: Result) {
  if (res === "ok") return +12;
  if (res === "warn") return -4;
  return -10;
}
function levelFromScore(score: number) {
  if (score < 40) return { label: "Novice", color: "bg-rose-500/20 text-rose-200", role: "Padawan des Logs" };
  if (score < 80) return { label: "Intermédiaire", color: "bg-amber-500/20 text-amber-200", role: "Script Tuner" };
  if (score < 120) return { label: "Confirmé", color: "bg-emerald-500/20 text-emerald-200", role: "SRE en short de bain" };
  return { label: "Expert", color: "bg-indigo-500/20 text-indigo-200", role: "Domptueur de Prod" };
}

/* =========================================================
   Composant principal
========================================================= */
export default function RunbookSimulator() {
  const [activeKey, setActiveKey] = useState<Scenario["key"]>("k8s-latency");
  const scenario = useMemo(
    () => RUNBOOKS.find((s) => s.key === activeKey)!,
    [activeKey]
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [status, setStatus] = useState<Result | null>(null); // résultat de la dernière action cliquée
  const [clickedId, setClickedId] = useState<string | null>(null); // pour afficher l’icône après clic
  const [lastOutput, setLastOutput] = useState("");

  // score persistant
  const [score, setScore] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    const s = window.localStorage.getItem("rb-score");
    return s ? Number(s) : 0;
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("rb-score", String(score));
    }
  }, [score]);

  const typed = useTypewriter(lastOutput, 10);
  const currentStep = scenario.steps[stepIndex];

  const resetScenario = () => {
    setStepIndex(0);
    setStatus(null);
    setClickedId(null);
    setLastOutput("");
  };
  const resetScore = () => setScore(0);

  const onAction = (a: Action) => {
    setClickedId(a.id);
    setStatus(a.result);
    setScore((s) => Math.max(0, s + scoreDelta(a.result))); // pas de score négatif
    setLastOutput(`$ ${a.label}\n\n${a.output}`);

    if (typeof a.next === "number") {
      setTimeout(() => {
        setStepIndex(a.next!);
        setStatus(null);
        setClickedId(null);
      }, 550);
    }
  };

  const finished =
    stepIndex >= scenario.steps.length - 1 &&
    status === "ok" &&
    !currentStep.actions.some((a) => typeof a.next === "number");

  const badge = levelFromScore(score);

  return (
    <section id="runbooks" className="section py-24 md:py-32">
      <div className="container mx-auto max-w-5xl px-6">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          className="text-3xl md:text-4xl font-semibold text-white"
        >
          Runbook Simulator
        </motion.h2>
        <p className="mt-3 text-neutral-400">
          Entraîne-toi à résoudre des incidents (Kubernetes, CI/CD, Réseau, Cloud). Clique les actions et gagne des points.
        </p>

        <div className="mt-3 flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/70 px-3 py-1.5 text-sm text-neutral-200">
            <Trophy size={16} className="text-primary" /> Score&nbsp;
            <span className="font-semibold text-white">{score}</span>
          </span>
          <span
            className={`rounded-full px-3 py-1.5 text-xs ${badge.color} border border-white/10`}
            title="Niveau basé sur le score total"
          >
            {badge.label} — {badge.role}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={resetScenario}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800/80"
            >
              <Repeat size={14} /> Réinitialiser le scénario
            </button>
            <button
              onClick={resetScore}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800/80"
            >
              <Trophy size={14} /> Remettre le score à 0
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* === Colonne gauche : scénarios === */}
          <div className="space-y-3">
            {RUNBOOKS.map((s) => (
              <button
                key={s.key}
                onClick={() => {
                  setActiveKey(s.key);
                  resetScenario();
                }}
                className={`w-full text-left rounded-2xl border px-4 py-3 transition ${
                  activeKey === s.key
                    ? "border-primary/60 bg-neutral-900/70"
                    : "border-neutral-800 bg-neutral-900/40 hover:bg-neutral-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex -space-x-2">
                    {s.icons.map((ic, i) => {
                      const isSvg =
                        typeof ic === "string" ? ic.endsWith(".svg") : false;
                      return (
                        <span
                          key={i}
                          className="relative inline-block h-7 w-7 overflow-hidden rounded-md ring-1 ring-white/10 bg-white"
                          style={{ zIndex: s.icons.length - i }}
                        >
                          <Image
                            src={ic}
                            alt=""
                            fill
                            sizes="28px"
                            className="object-contain"
                            unoptimized={isSvg}
                          />
                        </span>
                      );
                    })}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-white">
                      {s.title}
                    </div>
                    <div className="truncate text-xs text-neutral-400">
                      {s.subtitle}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* === Colonne droite : runbook === */}
          <div className="rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)]">
            {/* Header du runbook */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                <Play size={16} className="text-primary" />
              </span>
              <div className="text-white font-semibold">{scenario.title}</div>
              <span className="text-xs text-neutral-400">— {scenario.subtitle}</span>
            </div>

            {/* Progression (dots) */}
            <div className="mt-4 flex items-center gap-2">
              {scenario.steps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i <= stepIndex ? "w-6 bg-primary/70" : "w-2 bg-neutral-700"
                  }`}
                />
              ))}
            </div>

            {/* Étape courante */}
            <div className="mt-6">
              <div className="text-sm uppercase tracking-wide text-neutral-400">
                Étape {stepIndex + 1} / {scenario.steps.length} — {currentStep.title}
              </div>
              <div className="mt-1 text-lg text-white">{currentStep.prompt}</div>

              <div className="mt-4 space-y-2">
                {currentStep.actions.map((a) => {
                  const tone =
                    clickedId === a.id
                      ? a.result === "ok"
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : a.result === "warn"
                        ? "border-amber-500/30 bg-amber-500/10"
                        : "border-rose-500/30 bg-rose-500/10"
                      : "border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/70";

                  const RightIcon =
                    clickedId === a.id
                      ? a.result === "ok"
                        ? CheckCircle2
                        : a.result === "warn"
                        ? AlertTriangle
                        : XCircle
                      : ChevronRight;

                  return (
                    <motion.button
                      key={a.id}
                      onClick={() => onAction(a)}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full rounded-xl border px-3 py-2 text-left transition ${tone}`}
                    >
                      <div className="flex items-center gap-2 text-sm text-neutral-200">
                        <span className="h-5 w-5" />
                        <span>{a.label}</span>
                        <RightIcon size={16} className="ml-auto opacity-80" />
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Terminal simulé */}
            <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950/70">
              <div className="flex items-center justify-between border-b border-neutral-800 px-3 py-2">
                <div className="inline-flex items-center gap-2 text-xs text-neutral-400">
                  <Terminal size={14} /> sortie
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-rose-500/70" />
                  <span className="h-2 w-2 rounded-full bg-amber-500/70" />
                  <span className="h-2 w-2 rounded-full bg-emerald-500/70" />
                </div>
              </div>
              <div className="max-h-56 overflow-auto px-3 py-3 font-mono text-[12px] leading-relaxed text-neutral-200">
                <AnimatePresence mode="popLayout">
                  <motion.pre
                    key={typed}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {typed || "— en attente d'une action —"}
                  </motion.pre>
                </AnimatePresence>
              </div>
            </div>

            {/* Succès global */}
            {finished && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-200"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={18} />
                  <span className="font-medium">Résolu</span>
                </div>
                <p className="mt-1 text-sm text-emerald-100/90">
                  {scenario.successMessage}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
