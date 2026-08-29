import os
import sys
import subprocess
import json
import inquirer
from openai import OpenAI
from rich.console import Console
from rich.panel import Panel
from rich.syntax import Syntax

console = Console()

API_KEY = "sk-ws-H.DDMYYHR.1uEJ.MEUCIQCG_4SwiEcJyvyM7VJJr1ms39VWrXQkUr0HyXzWnfCwJAIgcTZCQjP59tk4putxzKQ1AKA4egnO-OYQQ1QHHvJMBzs"
BASE_URL = "https://dashscope-intl.aliyuncs.com/compatible-mode/v1"

AVAILABLE_MODELS = [
    "qwen3.8-flash",
    "qwen3.8-max",
    "qwen3.7-plus",
    "qwen3.7-max",
    "qwen3.6-flash",
    "deepseek-v4-pro",
    "glm-5.2"
]

client = OpenAI(
    api_key=API_KEY,
    base_url=BASE_URL
)

# ----------------- Определение инструментов (Tools) -----------------

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "run_command",
            "description": "Выполнить команду в терминале (PowerShell / Bash / CMD) и вернуть вывод.",
            "parameters": {
                "type": "object",
                "properties": {
                    "command": {"type": "string", "description": "Команда для выполнения"}
                },
                "required": ["command"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "read_file",
            "description": "Прочитать содержимое файла.",
            "parameters": {
                "type": "object",
                "properties": {
                    "filepath": {"type": "string", "description": "Относительный или абсолютный путь к файлу"}
                },
                "required": ["filepath"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "write_file",
            "description": "Создать новый файл или полностью перезаписать существующий.",
            "parameters": {
                "type": "object",
                "properties": {
                    "filepath": {"type": "string", "description": "Путь к файлу"},
                    "content": {"type": "string", "description": "Содержимое файла"}
                },
                "required": ["filepath", "content"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_directory",
            "description": "Посмотреть список файлов и папок в директории.",
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Путь к папке (по умолчанию текущая '.')"}
                }
            }
        }
    }
]

# ----------------- Исполнение инструментов -----------------

def execute_tool(name, args):
    try:
        if name == "run_command":
            cmd = args.get("command")
            console.print(f"[bold yellow]⚡ Запуск команды:[/bold yellow] [dim]{cmd}[/dim]")
            res = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=120)
            output = res.stdout if res.stdout else res.stderr
            return output if output else "[Команда выполнена без вывода]"

        elif name == "read_file":
            path = args.get("filepath")
            console.print(f"[bold blue]📖 Чтение файла:[/bold blue] [dim]{path}[/dim]")
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()

        elif name == "write_file":
            path = args.get("filepath")
            content = args.get("content")
            console.print(f"[bold green]✍️ Запись в файл:[/bold green] [dim]{path}[/dim]")
            os.makedirs(os.path.dirname(path), exist_ok=True) if os.path.dirname(path) else None
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            return f"Файл {path} успешно записан."

        elif name == "list_directory":
            path = args.get("path", ".")
            console.print(f"[bold magenta]📁 Список файлов в:[/bold magenta] [dim]{path}[/dim]")
            items = os.listdir(path)
            return "\n".join(items)

        return "Неизвестная функция"
    except Exception as e:
        return f"Ошибка выполнения {name}: {str(e)}"

# ----------------- Основной цикл -----------------

def select_model():
    questions = [
        inquirer.List(
            'model',
            message="Выберите модель",
            choices=AVAILABLE_MODELS,
            default=AVAILABLE_MODELS[0]
        ),
    ]
    answers = inquirer.prompt(questions)
    return answers['model'] if answers else AVAILABLE_MODELS[0]

def main():
    console.print(Panel.fit(
        "[bold cyan]Qwen Code Agent[/bold cyan] (Full System Access)\n"
        "[dim]Доступны: чтение/запись файлов, запуск терминала, просмотр папок.\n"
        "Команды: [bold]/model[/bold] — смена модели | [bold]/clear[/bold] — сброс | [bold]/exit[/bold] — выход[/dim]",
        border_style="cyan"
    ))

    current_model = select_model()
    console.print(f"[bold green]✓[/bold green] Модель: [bold yellow]{current_model}[/bold yellow]\n")

    system_prompt = (
        f"You are an expert autonomous coding agent running locally on the user's machine.\n"
        f"Current working directory: {os.getcwd()}\n"
        f"Operating system: {sys.platform}\n"
        f"You have tools to list files, read files, write/edit files, and run shell commands.\n"
        f"When asked to inspect, debug, or build a project, proactively use your tools to explore files and solve tasks."
    )

    history = [{"role": "system", "content": system_prompt}]

    while True:
        try:
            user_input = console.input(f"[bold blue]❯ [{current_model}][/bold blue] ").strip()
            if not user_input:
                continue

            if user_input.lower() in ["/exit", "exit", "quit", ":q"]:
                break
            
            if user_input.lower() == "/clear":
                history = [{"role": "system", "content": system_prompt}]
                console.print("[bold green]✓[/bold green] Контекст сброшен.\n")
                continue

            if user_input.lower() == "/model":
                current_model = select_model()
                console.print(f"[bold green]✓[/bold green] Переключено на: [bold yellow]{current_model}[/bold yellow]\n")
                continue

            history.append({"role": "user", "content": user_input})

            # Цикл автономной работы (Tool Calling Loop)
            while True:
                response = client.chat.completions.create(
                    model=current_model,
                    messages=history,
                    tools=TOOLS,
                    tool_choice="auto"
                )

                choice = response.choices[0].message
                history.append(choice)

                # Если модель хочет использовать инструменты
                if choice.tool_calls:
                    for tool_call in choice.tool_calls:
                        func_name = tool_call.function.name
                        func_args = json.loads(tool_call.function.arguments)

                        result = execute_tool(func_name, func_args)

                        history.append({
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "content": str(result)
                        })
                else:
                    # Модель выдала финальный ответ
                    console.print("\n[bold green]💬 Ответ:[/bold green]")
                    console.print(choice.content)
                    console.print("\n" + "─" * console.width + "\n", style="dim")
                    break

        except KeyboardInterrupt:
            console.print("\n[dim]Прервано. /exit для выхода.[/dim]")
        except Exception as e:
            console.print(f"\n[bold red]Ошибка:[/bold red] {str(e)}\n")

if __name__ == "__main__":
    main()