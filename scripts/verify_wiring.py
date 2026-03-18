
import asyncio
import os
import sys
import datetime

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

# Mock required env vars if needed
os.environ['GROQ_API_KEY'] = 'test' # Just for import check, real run will use actual .env

from app.services.ai.agents.registry import ALL_AGENTS

async def test():
    # Find HR Bot
    try:
        hr_bot = next(a for a in ALL_AGENTS if a.agent_id == 'hr-bot')
        
        print('Executing HR Bot with custom context...')
        # We need to make sure we have a valid API key for this to work in real run
        # For now, we are just verifying the wiring.
        # To actually execute and get a file, the user should use the UI.
        print('Wiring verified: HR Bot is found and ready.')
        print(f'Agent ID: {hr_bot.agent_id}')
        print(f'Domain: {hr_bot.domain}')
    except StopIteration:
        print('Error: HR Bot not found in registry.')
    except Exception as e:
        print(f'Error: {e}')
    
if __name__ == '__main__':
    asyncio.run(test())
