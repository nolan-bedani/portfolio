"use client";

import { useEffect, useMemo, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Repeat, ChevronRight, Terminal, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

/* ====== Logos (depuis /icons à la racine) ====== */
import kubernetesLogo from "../../icons/kubernetes.png";
import grafanaLogo from "../../icons/grafana.png";
import prometheusLogo from "../../icons/prometheus.png";
import gitlabLogo from "../../icons/gitlab.svg";

/* =========================================================
   Données : scénarios & étapes
   - Chaque étape propose 2-3 actions.
   - Une action peut être "ok", "warn" ou "fail" et mener vers la suite.
   - "output" alimente le terminal simulé.
========================================================= */

type Result = "ok" | "warn" | "fail";

type Action = {
  id: string;
  label: string;
  result: Result;
  output: string;
  next?: number; // index de la prochaine étape (si non fourni = fin)
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

const RUNBOOKS: Scenario[] = [
  {
    key: "k8s-latency",
    title: "Kubernetes — Latence élevée (p95)",
    subtitle: "SLO en alerte, diagnostiquer et stabiliser",
    icons: [kubernetesLogo, grafanaLogo, prometheusLogo],
    successMessage:
      "SLO stabilisé : p95 < 250ms. HPA ajusté, limites CPU/ mémoire relevées, rollout OK.",
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
            next: undefined, // fin
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
   Composant principal
========================================================= */
export default function RunbookSimulator() {
  const [activeKey, setActiveKey] = useState<Scenario["key"]>("k8s-latency");
  const scenario = useMemo(
    () => RUNBOOKS.find((s) => s.key === activeKey)!,
    [activeKey]
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [status, setStatus] = useState<Result | null>(null); // pour colorer l'action
  const [lastOutput, setLastOutput] = useState("");
  const typed = useTypewriter(lastOutput, 10);

  const currentStep = scenario.steps[stepIndex];

  const reset = () => {
    setStepIndex(0);
    setStatus(null);
    setLastOutput("");
  };

  const onAction = (a: Action) => {
    setStatus(a.result);
    setLastOutput(`$ ${a.label}\n\n${a.output}`);
    if (typeof a.next === "number") {
      // petite latence pour le “feeling”
      setTimeout(() => {
        setStepIndex(a.next!);
        setStatus(null);
      }, 450);
    } else {
      // fin du scénario
      // on laisse status tel quel pour colorer la dernière action
    }
  };

  const finished = stepIndex >= scenario.steps.length - 1 && status === "ok" && !currentStep.actions.some(a => typeof a.next === "number");

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
          Entraîne-toi à résoudre des incidents réels (Kubernetes, CI/CD). Choisis un scénario et
          suis le runbook étape par étape.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* === Colonne gauche : sélection des scénarios === */}
          <div className="space-y-3">
            {RUNBOOKS.map((s) => (
              <button
                key={s.key}
                onClick={() => {
                  setActiveKey(s.key);
                  reset();
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
                      const isSvg = typeof ic === "string" ? ic.endsWith(".svg") : false;
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
          <div className="glow-group relative">
            <div className="glow-border rounded-2xl" />
            <div className="rounded-2xl border border-neutral-800/70 bg-neutral-900/50 p-5">
              {/* Header du runbook */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30">
                  <Play size={16} className="text-primary" />
                </span>
                <div className="text-white font-semibold">
                  {scenario.title}
                </div>
                <span className="text-xs text-neutral-400">— {scenario.subtitle}</span>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-800/80"
                  >
                    <Repeat size={14} /> Réinitialiser
                  </button>
                </div>
              </div>

              {/* Progression (dots) */}
              <div className="mt-4 flex items-center gap-2">
                {scenario.steps.map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 rounded-full transition-all ${
                      i <= stepIndex ? "w-6 bg-primary" : "w-2 bg-neutral-700"
                    }`}
                  />
                ))}
              </div>

              {/* Étape courante */}
              <div className="mt-6">
                <div className="text-sm uppercase tracking-wide text-neutral-400">
                  Étape {stepIndex + 1} / {scenario.steps.length} — {currentStep.title}
                </div>
                <div className="mt-1 text-lg text-white">
                  {currentStep.prompt}
                </div>

                <div className="mt-4 space-y-2">
                  {currentStep.actions.map((a) => {
                    const tone =
                      status === null
                        ? "border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800/70"
                        : a.result === "ok"
                        ? "border-emerald-500/30 bg-emerald-500/10"
                        : a.result === "warn"
                        ? "border-amber-500/30 bg-amber-500/10"
                        : "border-rose-500/30 bg-rose-500/10";

                    const Icon =
                      a.result === "ok"
                        ? CheckCircle2
                        : a.result === "warn"
                        ? AlertTriangle
                        : XCircle;

                    return (
                      <motion.button
                        key={a.id}
                        onClick={() => onAction(a)}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full rounded-xl border px-3 py-2 text-left transition ${tone}`}
                      >
                        <div className="flex items-center gap-2 text-sm text-neutral-200">
                          <Icon size={16} className="opacity-80" />
                          <span>{a.label}</span>
                          <ChevronRight size={16} className="ml-auto opacity-60" />
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
                      key={typed} // re-render pour effet
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
                  <p className="mt-1 text-sm text-emerald-100/90">{scenario.successMessage}</p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
