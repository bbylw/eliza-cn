import { CheckIcon as Check } from "@phosphor-icons/react/dist/csr/Check";
import { CircleNotchIcon as CircleNotch } from "@phosphor-icons/react/dist/csr/CircleNotch";
import { PlayIcon as Play } from "@phosphor-icons/react/dist/csr/Play";
import { SparkleIcon as Sparkle } from "@phosphor-icons/react/dist/csr/Sparkle";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const scenarios = {
  research: {
    label: "研究一个项目",
    prompt: "分析 elizaOS 的插件边界，并给出上手路径。",
    result:
      "elizaOS 以 AgentRuntime 为核心，通过 actions、providers、services 与 app views 扩展能力。建议先运行本地项目，再创建一个只注册单一 action 的插件。",
    tools: ["文档检索", "记忆写入", "结果校验"],
  },
  orchestrate: {
    label: "编排多步任务",
    prompt: "整理发布说明，生成检查清单并安排定时任务。",
    result:
      "已完成内容提取、风险检查与任务编排。发布前需确认版本号、迁移说明和回滚步骤；定时任务将在获得授权后创建。",
    tools: ["内容解析", "工作流", "日历授权"],
  },
  automate: {
    label: "执行自动化",
    prompt: "观察构建失败日志，定位错误并提交修复建议。",
    result:
      "日志显示类型检查在插件边界处失败。建议收窄输入类型、补充运行时断言，并在连续变更前先执行最小范围测试。",
    tools: ["终端工具", "类型检查", "补丁预览"],
  },
} as const;

type ScenarioKey = keyof typeof scenarios;

export default function AgentConsole() {
  const [activeScenario, setActiveScenario] = useState<ScenarioKey>("research");
  const [prompt, setPrompt] = useState<string>(scenarios.research.prompt);
  const [result, setResult] = useState<string>(scenarios.research.result);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const runId = useRef(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      runId.current += 1;
    };
  }, []);

  const selectScenario = (key: ScenarioKey) => {
    setActiveScenario(key);
    setPrompt(scenarios[key].prompt);
    setResult(scenarios[key].result);
    setError("");
    setIsRunning(false);
  };

  const runAgent = () => {
    if (!prompt.trim()) {
      setError("请输入一个任务，再启动智能体。");
      return;
    }

    const currentRun = ++runId.current;
    setError("");
    setIsRunning(true);

    window.setTimeout(() => {
      if (currentRun !== runId.current) return;

      setResult(
        `${scenarios[activeScenario].result}\n\n已接收任务：${prompt.trim()}`,
      );
      setIsRunning(false);
    }, 850);
  };

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-ink-900 shadow-[0_32px_90px_rgba(0,0,0,0.34)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="relative flex size-2.5" aria-hidden="true">
            <span className="status-dot absolute inline-flex size-full rounded-full bg-signal-400" />
            <span className="relative inline-flex size-2.5 rounded-full bg-signal-400" />
          </span>
          <span className="text-sm font-medium">Eliza Runtime</span>
          <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-mist-500">
            Live demo
          </span>
        </div>
        <span className="font-mono text-xs text-mist-500">core / local</span>
      </div>

      <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
        <div className="border-b border-white/8 p-5 sm:p-6 lg:border-r lg:border-b-0">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-mist-500">
            选择任务
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
            {Object.entries(scenarios).map(([key, scenario]) => {
              const scenarioKey = key as ScenarioKey;
              const isActive = activeScenario === scenarioKey;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectScenario(scenarioKey)}
                  aria-pressed={isActive}
                  className={`flex min-h-12 items-center justify-between gap-3 rounded-xl border px-4 text-left text-sm ${
                    isActive
                      ? "border-signal-400/40 bg-signal-400/8 text-mist-100"
                      : "border-white/8 bg-white/[0.025] text-mist-300 hover:border-white/16 hover:bg-white/5"
                  }`}
                >
                  <span>{scenario.label}</span>
                  {isActive ? (
                    <Check size={16} className="shrink-0 text-signal-400" />
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-6 border-t border-white/8 pt-5">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
              <dt className="text-mist-500">运行模式</dt>
              <dd className="text-right text-mist-300">本地优先</dd>
              <dt className="text-mist-500">模型路由</dt>
              <dd className="text-right text-mist-300">自动选择</dd>
              <dt className="text-mist-500">权限边界</dt>
              <dd className="text-right text-mist-300">按需审批</dd>
            </dl>
          </div>
        </div>

        <div className="flex min-h-105 flex-col p-5 sm:p-6">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              runAgent();
            }}
          >
            <label
              htmlFor="agent-prompt"
              className="mb-2 block text-sm font-medium text-mist-100"
            >
              任务指令
            </label>
            <textarea
              id="agent-prompt"
              value={prompt}
              onChange={(event) => {
                setPrompt(event.target.value);
                if (error) setError("");
              }}
              rows={3}
              aria-describedby={
                error ? "agent-prompt-error" : "agent-prompt-help"
              }
              className="w-full resize-none rounded-xl border border-white/10 bg-ink-950/70 px-4 py-3 text-sm leading-6 text-mist-100 placeholder:text-mist-500 hover:border-white/18 focus:border-signal-400/60 focus:outline-none"
            />
            <div className="mt-2 min-h-5">
              {error ? (
                <p id="agent-prompt-error" className="text-xs text-red-300">
                  {error}
                </p>
              ) : (
                <p id="agent-prompt-help" className="text-xs text-mist-500">
                  演示模式会模拟本地编排流程，不发送任务数据。
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isRunning}
              className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-signal-400 px-5 text-sm font-semibold text-ink-950 hover:bg-signal-300 active:scale-[0.98] disabled:cursor-wait disabled:opacity-70"
            >
              {isRunning ? (
                <CircleNotch size={17} className="animate-spin" />
              ) : (
                <Play size={16} weight="fill" />
              )}
              {isRunning ? "正在编排" : "运行任务"}
            </button>
          </form>

          <div className="mt-6 flex-1 border-t border-white/8 pt-5">
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="text-xs font-medium text-mist-300">
                执行结果
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-mist-500">
                {isRunning ? "running" : "ready"}
              </span>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${activeScenario}-${isRunning ? "loading" : "result"}`}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                aria-live="polite"
                aria-busy={isRunning}
              >
                {isRunning ? (
                  <div className="space-y-3" aria-label="任务执行中">
                    <div className="h-3 w-3/4 animate-pulse rounded-full bg-white/8" />
                    <div className="h-3 w-full animate-pulse rounded-full bg-white/6" />
                    <div className="h-3 w-5/6 animate-pulse rounded-full bg-white/6" />
                  </div>
                ) : (
                  <>
                    <p className="text-sm leading-7 whitespace-pre-line text-mist-300">
                      {result}
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {scenarios[activeScenario].tools.map((tool) => (
                        <span
                          key={tool}
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/9 px-3 py-1.5 text-xs text-mist-500"
                        >
                          <Sparkle size={12} className="text-signal-400" />
                          {tool}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
