import os
from typing import List, Dict
import anthropic
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")

SYSTEM_PROMPT = """You are a friendly and helpful booking assistant for San Pedro Sport Fishing, a fishing charter company based in San Pedro, California. Your job is to respond to incoming text messages from potential customers, answer their questions, and capture their booking information.

About the business:
- Full day trips: $225/person, departs 5:30am, returns ~3:30pm
- Half day trips: $125/person, departs 6:00am, returns ~11:00am
- Private charters: $1,800 flat rate, up to 6 passengers
- Open Tuesday through Sunday
- Maximum 6 passengers per shared trip
- All gear and bait included
- Located at Ports O Call Village, San Pedro, CA

Your goal in every conversation is to:
1. Answer any questions they have warmly and accurately
2. Capture their full name, preferred trip type, preferred date, and group size
3. Once all four are captured, let them know the team will call to confirm within 2 hours
4. Keep messages short, warm, and conversational — this is SMS not email
5. Never make up availability — if asked about a specific date just say the team will confirm when they call
6. Always end with a friendly sign-off and a fishing emoji 🎣

Never break character. You are representing San Pedro Sport Fishing."""

BOOKING_FIELDS = {"full_name", "trip_type", "preferred_date", "group_size"}

QUALIFIED_CONFIRMATION = (
    "Perfect! I've got your info and the team will call you within 2 hours "
    "to confirm your booking. Talk soon! 🎣"
)


def build_messages_for_claude(
    conversation_history: List[Dict[str, str]], new_user_message: str
) -> List[Dict[str, str]]:
    """
    Build the messages list for the Claude API call.

    conversation_history: list of {"role": "user"|"assistant", "content": "..."}
    new_user_message: the latest inbound SMS text
    """
    messages = list(conversation_history)
    messages.append({"role": "user", "content": new_user_message})
    return messages


def get_ai_reply(
    conversation_history: List[Dict[str, str]], new_user_message: str
) -> str:
    """
    Call the Claude API and return the assistant's text reply.

    Args:
        conversation_history: Previous turns as list of role/content dicts
        new_user_message: Latest inbound message from the customer

    Returns:
        The AI's reply string
    """
    if not ANTHROPIC_API_KEY:
        raise EnvironmentError("ANTHROPIC_API_KEY must be set in environment.")

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    messages = build_messages_for_claude(conversation_history, new_user_message)

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=300,
        system=SYSTEM_PROMPT,
        messages=messages,
    )

    return response.content[0].text


def check_lead_qualified(conversation_history: List[Dict[str, str]]) -> bool:
    """
    Ask Claude to assess whether all four booking fields have been captured
    in the conversation so far.

    Returns True if the lead should be marked qualified.
    """
    if not ANTHROPIC_API_KEY:
        return False

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    check_prompt = (
        "Based on the conversation above, have ALL FOUR of the following been clearly captured?\n"
        "1. Customer's full name\n"
        "2. Trip type (full day, half day, or private charter)\n"
        "3. Preferred date\n"
        "4. Group size (number of people)\n\n"
        "Reply with only 'YES' if all four are captured, or 'NO' if any are still missing."
    )

    messages = list(conversation_history)
    messages.append({"role": "user", "content": check_prompt})

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=10,
        system="You are a data extraction assistant. Answer only YES or NO.",
        messages=messages,
    )

    answer = response.content[0].text.strip().upper()
    return answer.startswith("YES")
